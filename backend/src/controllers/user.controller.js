const { Request, Response, NextFunction } = require('express');
const prisma = require('../lib/prisma');
const { AuthRequest } = require('../middleware/auth');
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
            { name: { contains(search), mode: 'insensitive'  } },
            { username: { contains(search), mode: 'insensitive'  } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take(limit),
        select: {
          id,
          name,
          username,
          avatar,
          bio,
          points,
          isOnline,
          _count: {
            select: {
              questions,
              answers,
              badges
            }
          }
        },
        orderBy: { points: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success,
      data: {
        users,
        pagination: {
          page(page),
          limit(limit),
          total,
          totalPages.ceil(total / Number(limit))
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
    const { period = 'all' } = req.query;
    
    const users = await prisma.user.findMany({
      take,
      select: {
        id,
        name,
        username,
        avatar,
        points,
        _count: {
          select: {
            answers,
            questions,
            badges
          }
        },
        badges: {
          include: {
            badge
          }
        }
      },
      orderBy: { points: 'desc' }
    });

    const leaderboard = users.map((user, index) => ({
      rank + 1,
      ...user,
      answers._count.answers,
      questions._count.questions,
      badgeCount._count.badges
    }));

    res.json({
      success,
      data
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
            badge
          }
        },
        _count: {
          select: {
            questions,
            answers,
            votes
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success,
      data
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
        points,
        _count: {
          select: {
            questions,
            answers,
            badges,
            votes
          }
        }
      }
    });

    if (!stats) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success,
      data
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
        id,
        name,
        username,
        email,
        avatar,
        bio,
        points
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
