const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { notifications } = require('../services/notification.service');

/**
 * Vote on a question or answer
 * Handles upvote (+1), downvote (-1), and vote removal
 */
const vote = asyncHandler(async (req, res) => {
  const { value, questionId, answerId } = req.body;
  const userId = req.userId;

  // Validation
  if (!questionId && !answerId) {
    throw ApiError.badRequest('Either questionId or answerId is required');
  }

  if (questionId && answerId) {
    throw ApiError.badRequest('Cannot vote on both question and answer simultaneously');
  }

  if (value !== 1 && value !== -1) {
    throw ApiError.badRequest('Vote value must be 1 (upvote) or -1 (downvote)');
  }

  // Validate MongoDB ObjectID format
  const objectIdRegex = /^[a-f\d]{24}$/i;
  if (questionId && !objectIdRegex.test(questionId)) {
    throw ApiError.badRequest('Invalid question ID format');
  }
  if (answerId && !objectIdRegex.test(answerId)) {
    throw ApiError.badRequest('Invalid answer ID format');
  }

  // Check if content exists
  if (questionId) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw ApiError.notFound('Question not found');
    }
    
    // Prevent voting on own question
    if (question.authorId === userId) {
      throw ApiError.badRequest('Cannot vote on your own question');
    }
  }

  if (answerId) {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw ApiError.notFound('Answer not found');
    }
    
    // Prevent voting on own answer
    if (answer.authorId === userId) {
      throw ApiError.badRequest('Cannot vote on your own answer');
    }
  }

  // Check if vote already exists
  const existingVote = await prisma.vote.findFirst({
    where: {
      userId,
      ...(questionId ? { questionId } : { answerId })
    }
  });

  let result;
  let action;

  if (existingVote) {
    if (existingVote.value === value) {
      // Remove vote if clicking same button (toggle off)
      await prisma.vote.delete({
        where: { id: existingVote.id }
      });

      // Revert points
      if (questionId) {
        const question = await prisma.question.findUnique({ where: { id: questionId } });
        await prisma.user.update({
          where: { id: question.authorId },
          data: { points: { decrement: value * 5 } }
        });
      } else if (answerId) {
        const answer = await prisma.answer.findUnique({ where: { id: answerId } });
        await prisma.user.update({
          where: { id: answer.authorId },
          data: { points: { decrement: value * 5 } }
        });
      }

      action = 'removed';
      result = null;
    } else {
      // Update vote if changing from upvote to downvote or vice versa
      result = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { value }
      });

      // Update points (remove old, add new = net change of 2x)
      const pointChange = (value - existingVote.value) * 5; // Will be +10 or -10

      if (questionId) {
        const question = await prisma.question.findUnique({ where: { id: questionId } });
        await prisma.user.update({
          where: { id: question.authorId },
          data: { points: { increment: pointChange } }
        });
      } else if (answerId) {
        const answer = await prisma.answer.findUnique({ where: { id: answerId } });
        await prisma.user.update({
          where: { id: answer.authorId },
          data: { points: { increment: pointChange } }
        });
      }

      action = 'updated';
    }
  } else {
    // Create new vote
    result = await prisma.vote.create({
      data: {
        value,
        userId,
        ...(questionId ? { questionId } : { answerId })
      }
    });

    // Award points to content author
    if (questionId) {
      const question = await prisma.question.findUnique({ where: { id: questionId } });
      await prisma.user.update({
        where: { id: question.authorId },
        data: { points: { increment: value * 5 } }
      });

      // Send notification
      notifications.notify({
        type: 'vote',
        message: `Your question received ${value === 1 ? 'an upvote' : 'a downvote'}`,
        data: { questionId, value },
        targetUserId: question.authorId
      });
    } else if (answerId) {
      const answer = await prisma.answer.findUnique({ where: { id: answerId } });
      await prisma.user.update({
        where: { id: answer.authorId },
        data: { points: { increment: value * 5 } }
      });

      // Send notification
      notifications.notify({
        type: 'vote',
        message: `Your answer received ${value === 1 ? 'an upvote' : 'a downvote'}`,
        data: { answerId, value },
        targetUserId: answer.authorId
      });
    }

    action = 'created';
  }

  // Get current vote count
  const voteCount = await prisma.vote.aggregate({
    where: questionId ? { questionId } : { answerId },
    _sum: { value: true }
  });

  ApiResponse.success(res, {
    vote: result,
    action,
    totalVotes: voteCount._sum.value || 0,
  }, `Vote ${action} successfully`);
});

/**
 * Get user's vote on a question or answer
 */
const getUserVote = asyncHandler(async (req, res) => {
  const { questionId, answerId } = req.query;
  const userId = req.userId;

  if (!questionId && !answerId) {
    throw ApiError.badRequest('Either questionId or answerId is required');
  }

  const vote = await prisma.vote.findFirst({
    where: {
      userId,
      ...(questionId ? { questionId } : { answerId })
    }
  });

  ApiResponse.success(res, {
    vote: vote ? vote.value : 0,
    hasVoted: !!vote,
  });
});

/**
 * Get vote statistics for a question or answer
 */
const getVoteStats = asyncHandler(async (req, res) => {
  const { questionId, answerId } = req.query;

  if (!questionId && !answerId) {
    throw ApiError.badRequest('Either questionId or answerId is required');
  }

  const where = questionId ? { questionId } : { answerId };

  const [totalVotes, upvotes, downvotes] = await Promise.all([
    prisma.vote.aggregate({
      where,
      _sum: { value: true }
    }),
    prisma.vote.count({
      where: { ...where, value: 1 }
    }),
    prisma.vote.count({
      where: { ...where, value: -1 }
    }),
  ]);

  ApiResponse.success(res, {
    score: totalVotes._sum.value || 0,
    upvotes,
    downvotes,
    total: upvotes + downvotes,
  });
});

module.exports = {
  vote,
  getUserVote,
  getVoteStats,
};
