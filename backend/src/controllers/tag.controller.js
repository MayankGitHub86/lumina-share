const { Request, Response, NextFunction } = require('express');
const prisma = require('../lib/prisma');

const getAllTags = async (
  req,
  res,
  next
) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      }
    });

    const formattedTags = tags
      .map(tag => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        count: tag._count.questions,
        createdAt: tag.createdAt
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: formattedTags
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
    const { limit = 10 } = req.query;
    
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      }
    });

    const formattedTags = tags
      .map(tag => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        count: tag._count.questions,
        createdAt: tag.createdAt
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, Number(limit));

    res.json({
      success: true,
      data: formattedTags
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
            tagId: id
          }
        }
      },
      skip,
      take: Number(limit),
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            answers: true,
            votes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllTags,
  getPopularTags,
  getQuestionsByTag
};
