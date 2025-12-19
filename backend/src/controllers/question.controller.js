const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { AuthRequest } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { notifications } = require('../services/notification.service');

const getAllQuestions = async (
  req,
  res,
  next
) => {
  try {
    const { page = 1, limit = 20, category, search, sort = 'recent' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let orderBy = { createdAt: 'desc' };
    if (sort === 'votes') orderBy = { votes: { _count: 'desc' } };
    if (sort === 'views') orderBy = { views: 'desc' };

    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'all') {
      where.tags = {
        some: {
          tag: {
            name: { equals: category, mode: 'insensitive' }
          }
        }
      };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
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
              votes: true,
              comments: true
            }
          }
        },
        orderBy
      }),
      prisma.question.count({ where })
    ]);

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      title: q.title,
      preview: q.preview,
      author: q.author,
      tags: q.tags.map(t => t.tag.name),
      votes: q._count.votes,
      answers: q._count.answers,
      views: q.views,
      isSolved: q.isSolved,
      createdAt: q.createdAt
    }));

    res.json({
      success: true,
      data: {
        questions: formattedQuestions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTrendingQuestions = async (
  req,
  res,
  next
) => {
  try {
    const questions = await prisma.question.findMany({
      take: 10,
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
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
      orderBy: {
        views: 'desc'
      }
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getQuestionById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            points: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                points: true
              }
            },
            _count: {
              select: {
                votes: true
              }
            }
          },
          orderBy: {
            isAccepted: 'desc'
          }
        },
        votes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    // Increment view count
    await prisma.question.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

const createQuestion = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;
    const userId = req.userId;

    // Generate preview (first 200 chars)
    const preview = content.substring(0, 200);

    // Create or find tags
    const tagObjects = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName }
          });
        }

        return tag;
      })
    );

    // Create question
    const question = await prisma.question.create({
      data: {
        title,
        content,
        preview,
        authorId: userId,
        tags: {
          create: tagObjects.map(tag => ({
            tagId: tag.id
          }))
        }
      },
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
        }
      }
    });

    // Notify subscribers about new question
    notifications.notify({
      type: 'question',
      message: 'New question posted',
      data: { id: question.id, title: question.title, author: question.author }
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    if (question.authorId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const preview = content.substring(0, 200);

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: { title, content, preview },
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
        }
      }
    });

    res.json({
      success: true,
      data: updatedQuestion
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    if (question.authorId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    await prisma.question.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const saveQuestion = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await prisma.savedQuestion.create({
      data: {
        userId,
        questionId: id
      }
    });

    res.json({
      success: true,
      message: 'Question saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const unsaveQuestion = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await prisma.savedQuestion.delete({
      where: {
        userId_questionId: {
          userId,
          questionId: id
        }
      }
    });

    res.json({
      success: true,
      message: 'Question unsaved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuestions,
  getTrendingQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  saveQuestion,
  unsaveQuestion
};
