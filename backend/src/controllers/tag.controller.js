const { Request, Response, NextFunction } = require('express');
const prisma = require('../lib/prisma');

const getAllTags = async (
  req,
  res,
  next
) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { count: 'desc' }
    });

    res.json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getPopularTags = async (
  req,
  res,
  next
) => {
  try {
    const tags = await prisma.tag.findMany({
      take,
      orderBy: { count: 'desc' }
    });

    res.json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getQuestionsByTag = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const questions = await prisma.question.findMany({
      where: {
        tags: {
          some: {
            tagId
          }
        }
      },
      skip,
      take(limit),
      include: {
        author: {
          select: {
            id,
            name,
            username,
            avatar
          }
        },
        tags: {
          include: {
            tag
          }
        },
        _count: {
          select: {
            answers,
            votes
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success,
      data
    });
  } catch (error) {
    next(error);
  }
};
