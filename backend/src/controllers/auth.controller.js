const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { AppError } = require('../middleware/errorHandler');

const register = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors.array() });
    }

    const { email, username, name, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success,
      data: {
        user: {
          id.id,
          email.email,
          username.username,
          name.name,
          avatar.avatar
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update online status
    await prisma.user.update({
      where: { id.id },
      data: { isOnline }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success,
      data: {
        user: {
          id.id,
          email.email,
          username.username,
          name.name,
          avatar.avatar,
          points.points
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
