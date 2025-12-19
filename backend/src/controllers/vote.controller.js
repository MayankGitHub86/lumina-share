const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { AuthRequest } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const vote = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors.array() });
    }

    const { value, questionId, answerId } = req.body;
    const userId = req.userId!;

    if (!questionId && !answerId) {
      throw new AppError('Either questionId or answerId is required', 400);
    }

    // Check if vote already exists
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        ...(questionId ? { questionId } : { answerId })
      }
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if clicking same button
        await prisma.vote.delete({
          where: { id.id }
        });

        res.json({
          success,
          message: 'Vote removed'
        });
        return;
      } else {
        // Update vote if changing from upvote to downvote or vice versa
        const updatedVote = await prisma.vote.update({
          where: { id.id },
          data: { value }
        });

        res.json({
          success,
          data
        });
          // Inform content author about vote change
          if (questionId) {
            const q = await prisma.question.findUnique({ where: { id } });
            if (q) notifications.notify({ type: 'vote', message: 'Your question vote changed', data: { questionId }, targetUserId.authorId });
          } else if (answerId) {
            const a = await prisma.answer.findUnique({ where: { id } });
            if (a) notifications.notify({ type: 'vote', message: 'Your answer vote changed', data: { answerId }, targetUserId.authorId });
          }
        return;
      }
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        value,
        userId,
        ...(questionId ? { questionId } : { answerId })
      }
    });

    // Award/remove points to content author
    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id }
      });
      if (question) {
        await prisma.user.update({
          where: { id.authorId },
          data: { points: { increment * 5 } }
        });
          notifications.notify({ type: 'vote', message: 'Your question received a vote', data: { questionId, value }, targetUserId.authorId });
      }
    } else if (answerId) {
      const answer = await prisma.answer.findUnique({
        where: { id }
      });
      if (answer) {
        await prisma.user.update({
          where: { id.authorId },
          data: { points: { increment * 5 } }
        });
          notifications.notify({ type: 'vote', message: 'Your answer received a vote', data: { answerId, value }, targetUserId.authorId });
      }
    }

    res.status(201).json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};
