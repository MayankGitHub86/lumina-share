const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { AuthRequest } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { notifications } = require('../services/notification.service');

const vote = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { value, questionId, answerId } = req.body;
    const userId = req.userId;

    if (!questionId && !answerId) {
      throw new AppError('Either questionId or answerId is required', 400);
    }

    // Validate MongoDB ObjectID format
    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (questionId && !objectIdRegex.test(questionId)) {
      throw new AppError('Invalid question ID format', 400);
    }
    if (answerId && !objectIdRegex.test(answerId)) {
      throw new AppError('Invalid answer ID format', 400);
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
          where: { id: existingVote.id }
        });

        res.json({
          success: true,
          message: 'Vote removed'
        });
        return;
      } else {
        // Update vote if changing from upvote to downvote or vice versa
        const updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value }
        });

        res.json({
          success: true,
          data: updatedVote
        });
        // Inform content author about vote change
        if (questionId) {
          const q = await prisma.question.findUnique({ where: { id: questionId } });
          if (q) notifications.notify({ type: 'vote', message: 'Your question vote changed', data: { questionId }, targetUserId: q.authorId });
        } else if (answerId) {
          const a = await prisma.answer.findUnique({ where: { id: answerId } });
          if (a) notifications.notify({ type: 'vote', message: 'Your answer vote changed', data: { answerId }, targetUserId: a.authorId });
        }
        return;
      }
    }

    // Create new vote
    const newVote = await prisma.vote.create({
      data: {
        value,
        userId,
        ...(questionId ? { questionId } : { answerId })
      }
    });

    // Award/remove points to content author
    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      });
      if (question) {
        await prisma.user.update({
          where: { id: question.authorId },
          data: { points: { increment: value * 5 } }
        });
        notifications.notify({ type: 'vote', message: 'Your question received a vote', data: { questionId, value }, targetUserId: question.authorId });
      }
    } else if (answerId) {
      const answer = await prisma.answer.findUnique({
        where: { id: answerId }
      });
      if (answer) {
        await prisma.user.update({
          where: { id: answer.authorId },
          data: { points: { increment: value * 5 } }
        });
        notifications.notify({ type: 'vote', message: 'Your answer received a vote', data: { answerId, value }, targetUserId: answer.authorId });
      }
    }

    res.status(201).json({
      success: true,
      data: newVote
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  vote
};