const prisma = require('../lib/prisma');
const { AppError } = require('../middleware/errorHandler');

const getAllUsers = async (
  req,
  res,
  next
) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          points: true,
          isOnline: true,
          _count: {
            select: {
              questions: true,
              answers: true,
              badges: true
            }
          }
        },
        orderBy: { points: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
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

const getLeaderboard = async (
  req,
  res,
  next
) => {
  try {
    const { period = 'all', limit = 10 } = req.query;
    
    const users = await prisma.user.findMany({
      take: Number(limit),
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        points: true,
        _count: {
          select: {
            answers: true,
            questions: true,
            badges: true
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      },
      orderBy: { points: 'desc' }
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user,
      answers: user._count.answers,
      questions: user._count.questions,
      badgeCount: user._count.badges
    }));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        _count: {
          select: {
            questions: true,
            answers: true,
            votes: true,
            savedQuestions: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const stats = await prisma.user.findUnique({
      where: { id },
      select: {
        points: true,
        _count: {
          select: {
            questions: true,
            answers: true,
            badges: true,
            votes: true,
            savedQuestions: true
          }
        }
      }
    });

    if (!stats) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        points: stats.points,
        questionsAsked: stats._count.questions,
        answersGiven: stats._count.answers,
        savedItems: stats._count.savedQuestions,
        votes: stats._count.votes,
        badges: stats._count.badges
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { name, bio, avatar } = req.body;

    if (req.userId !== id) {
      throw new AppError('Unauthorized', 403);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, bio, avatar },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        points: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const getSavedQuestions = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const savedQuestions = await prisma.savedQuestion.findMany({
      where: { userId: id },
      include: {
        question: {
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
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    });

    const formattedQuestions = savedQuestions.map(sq => ({
      ...sq.question,
      savedAt: sq.savedAt,
      tags: sq.question.tags.map(t => t.tag)
    }));

    res.json({
      success: true,
      data: formattedQuestions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getLeaderboard,
  getUserById,
  getUserStats,
  updateUser,
  getSavedQuestions
};
