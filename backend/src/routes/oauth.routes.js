const { Router, Request, Response } = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = Router();
const prisma = new PrismaClient();

// Google OAuth handler
router.post('/oauth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: { message: 'No ID token provided' } });
    }

    // In production, verify the token with Google's public key
    // For now, decode it (not secure for production!)
    const decoded = jwt.decode(idToken) ;

    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email.email,
          username.email.split('@')[0],
          name.name || decoded.email,
          password: '', // OAuth users don't have password
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId.id, email.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id.id,
          email.email,
          username.username,
          name.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: { message.message } });
  }
});

// Microsoft OAuth handler
router.post('/oauth/microsoft', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: { message: 'No access token provided' } });
    }

    // Fetch user info from Microsoft Graph API
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Microsoft user info');
    }

    const microsoftUser = await response.json();

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email.userPrincipalName },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email.userPrincipalName,
          username.mailNickname || microsoftUser.userPrincipalName.split('@')[0],
          name.displayName,
          password: '',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId.id, email.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id.id,
          email.email,
          username.username,
          name.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: { message.message } });
  }
});

// GitHub OAuth callback handler
router.post('/oauth/github', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: { message: 'No authorization code provided' } });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body.stringify({
        client_id.env.GITHUB_CLIENT_ID,
        client_secret.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('Failed to get GitHub access token');
    }

    // Fetch user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const githubUser = await userResponse.json();

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email.email,
          username.login,
          name.name,
          password: '',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId.id, email.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id.id,
          email.email,
          username.username,
          name.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: { message.message } });
  }
});

module.exports = router;
