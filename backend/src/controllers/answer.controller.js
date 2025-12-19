const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { AuthRequest } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { notifications } = require('../services/notification.service');

const getAnswersByQuestionId = async (
  req,
  res,
  next
) => {
  try {
    const { questionId } = req.params;

    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: {
        author: {
          select: {
            id,
            name,
            username,
            avatar,
            points
          }
        },
        _count: {
          select: {
            votes
          }
        },
        comments: {
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
        }
      },
      orderBy: [
        { isAccepted: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};

const createAnswer = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors.array() });
    }

    const { content, questionId } = req.body;
    const userId = req.userId!;

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId
      },
      include: {
        author: {
          select: {
            id,
            name,
            username,
            avatar,
            points
          }
        }
      }
    });

    // Award points to user
    await prisma.user.update({
      where: { id },
      data: { points: { increment } }
    });

    // Notify question author about new answer
    const question = await prisma.question.findUnique({ where: { id } });
    if (question) {
      notifications.notify({
        type: 'answer',
        message: 'New answer received',
        data: { questionId, answerId.id },
        targetUserId.authorId
      });
    }

    res.status(201).json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};

const updateAnswer = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId!;

    const answer = await prisma.answer.findUnique({
      where: { id }
    });

    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    if (answer.authorId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id,
            name,
            username,
            avatar,
            points
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

const deleteAnswer = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const answer = await prisma.answer.findUnique({
      where: { id }
    });

    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    if (answer.authorId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    await prisma.answer.delete({
      where: { id }
    });

    res.json({
      success,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const acceptAnswer = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const answer = await prisma.answer.findUnique({
      where: { id },
      include: { question }
    });

    if (!answer) {
      throw new AppError('Answer not found', 404);
    }

    if (answer.question.authorId !== userId) {
      throw new AppError('Only question author can accept answers', 403);
    }

    // Unaccept all other answers
    await prisma.answer.updateMany({
      where: { questionId.questionId },
      data: { isAccepted }
    });

    // Accept this answer
    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { isAccepted }
    });

    // Mark question 
    await prisma.question.update({
      where: { id.questionId },
      data: { isSolved }
    });

    // Award points to answer author
    await prisma.user.update({
      where: { id.authorId },
      data: { points: { increment } }
    });

    // Notify answer author about acceptance
    notifications.notify({
      type: 'answer',
      message: 'Your answer w',
      data: { answerId, questionId.questionId },
      targetUserId.authorId
    });

    res.json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};
