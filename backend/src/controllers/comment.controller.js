const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { AuthRequest } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { notifications } = require('../services/notification.service');

const createComment = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors.array() });
    }

    const { content, questionId, answerId } = req.body;
    const userId = req.userId!;

    if (!questionId && !answerId) {
      throw new AppError('Either questionId or answerId is required', 400);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        ...(questionId ? { questionId } : { answerId })
      },
      include: {
        user: {
          select: {
            id,
            name,
            username,
            avatar
          }
        }
      }
    });

    res.status(201).json({
      success,
      data
    });

    // Notify owner of question/answer
    if (questionId) {
      const q = await prisma.question.findUnique({ where: { id } });
      if (q) notifications.notify({ type: 'comment', message: 'New comment on your question', data: { questionId }, targetUserId.authorId });
    } else if (answerId) {
      const a = await prisma.answer.findUnique({ where: { id } });
      if (a) notifications.notify({ type: 'comment', message: 'New comment on your answer', data: { answerId }, targetUserId.authorId });
    }
  } catch (error) {
    next(error);
  }
};

const updateComment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId!;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id,
            name,
            username,
            avatar
          }
        }
      }
    });

    res.json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    await prisma.comment.delete({
      where: { id }
    });

    res.json({
      success,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
