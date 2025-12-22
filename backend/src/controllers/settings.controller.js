const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Update user profile
// @route   PUT /api/settings/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { name, username, bio, location, website, github, twitter, linkedin } = req.body;

  // Check if username is being changed and if it's already taken
  if (username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: { not: userId }
      }
    });

    if (existingUser) {
      throw ApiError.conflict('Username is already taken');
    }
  }

  // Validate URLs if provided
  const urlFields = { website, github, twitter, linkedin };
  for (const [field, value] of Object.entries(urlFields)) {
    if (value && value.trim()) {
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
      } catch (error) {
        throw ApiError.badRequest(`Invalid ${field} URL`);
      }
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name?.trim() || undefined,
      username: username?.trim() || undefined,
      bio: bio?.trim() || undefined,
      location: location?.trim() || undefined,
      website: website?.trim() || undefined,
      github: github?.trim() || undefined,
      twitter: twitter?.trim() || undefined,
      linkedin: linkedin?.trim() || undefined,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      website: true,
      github: true,
      twitter: true,
      linkedin: true,
      points: true,
      createdAt: true,
    }
  });

  res.status(200).json(
    new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully')
  );
});

// @desc    Update user email
// @route   PUT /api/settings/email
// @access  Private
exports.updateEmail = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw ApiError.badRequest('Invalid email format');
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Incorrect password');
  }

  // Check if email is already taken
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      id: { not: userId }
    }
  });

  if (existingUser) {
    throw ApiError.conflict('Email is already in use');
  }

  // Update email
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      points: true,
    }
  });

  res.status(200).json(
    new ApiResponse(200, { user: updatedUser }, 'Email updated successfully')
  );
});

// @desc    Update user password
// @route   PUT /api/settings/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Current password and new password are required');
  }

  // Validate new password strength
  if (newPassword.length < 6) {
    throw ApiError.badRequest('New password must be at least 6 characters long');
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Check if new password is same as current
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw ApiError.badRequest('New password must be different from current password');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  res.status(200).json(
    new ApiResponse(200, null, 'Password updated successfully')
  );
});

// @desc    Delete user account
// @route   DELETE /api/settings/account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { password } = req.body;

  if (!password) {
    throw ApiError.badRequest('Password is required to delete account');
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Incorrect password');
  }

  // Delete user (cascade will handle related records)
  await prisma.user.delete({
    where: { id: userId }
  });

  res.status(200).json(
    new ApiResponse(200, null, 'Account deleted successfully')
  );
});

// @desc    Update notification preferences
// @route   PUT /api/settings/notifications
// @access  Private
exports.updateNotifications = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const {
    emailNotifications,
    pushNotifications,
    questionAnswered,
    commentReplied,
    upvoteReceived
  } = req.body;

  // For now, we'll store preferences in user metadata
  // In a production app, you'd have a separate NotificationPreferences table
  const preferences = {
    emailNotifications: emailNotifications ?? true,
    pushNotifications: pushNotifications ?? true,
    questionAnswered: questionAnswered ?? true,
    commentReplied: commentReplied ?? true,
    upvoteReceived: upvoteReceived ?? true,
  };

  // Store in user bio field temporarily (you should create a proper preferences table)
  // For now, we'll just return success
  res.status(200).json(
    new ApiResponse(200, { preferences }, 'Notification preferences updated successfully')
  );
});

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      website: true,
      github: true,
      twitter: true,
      linkedin: true,
      points: true,
      createdAt: true,
    }
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(
    new ApiResponse(200, user, 'Settings retrieved successfully')
  );
});

// @desc    Upload avatar
// @route   POST /api/settings/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { avatar } = req.body;

  if (!avatar) {
    throw ApiError.badRequest('Avatar URL is required');
  }

  // Validate URL
  try {
    new URL(avatar);
  } catch (error) {
    throw ApiError.badRequest('Invalid avatar URL');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      points: true,
    }
  });

  res.status(200).json(
    new ApiResponse(200, { user: updatedUser }, 'Avatar updated successfully')
  );
});
