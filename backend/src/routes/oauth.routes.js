const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

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
    const decoded = jwt.decode(idToken);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decoded.email,
          username: decoded.email.split('@')[0],
          name: decoded.name || decoded.email,
          password: '', // OAuth users don't have password
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

// Google OAuth2 callback handler (code exchange)
router.post('/oauth/google/callback', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: { message: 'No authorization code provided' } });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = redirectUri || `${process.env.FRONTEND_URL}/login`;

    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenResponse.data;

    if (!id_token) {
      throw new Error('No ID token received from Google');
    }

    // Decode the ID token
    const decoded = jwt.decode(id_token);

    if (!decoded || !decoded.email) {
      throw new Error('Invalid ID token');
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decoded.email,
          username: decoded.email.split('@')[0],
          name: decoded.name || decoded.email,
          password: '',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ error: { message: error.message } });
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
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const microsoftUser = response.data;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: microsoftUser.userPrincipalName },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: microsoftUser.userPrincipalName,
          username: microsoftUser.mailNickname || microsoftUser.userPrincipalName.split('@')[0],
          name: microsoftUser.displayName,
          password: '',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    res.status(500).json({ error: { message: error.message } });
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
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const tokenData = tokenResponse.data;
    if (!tokenData.access_token) {
      throw new Error('Failed to get GitHub access token');
    }

    // Fetch user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const githubUser = userResponse.data;

    // If email is not public, fetch it from emails endpoint
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const emails = emailsResponse.data;
      const primaryEmail = emails.find(e => e.primary && e.verified);
      email = primaryEmail ? primaryEmail.email : emails[0]?.email;
    }

    if (!email) {
      throw new Error('Unable to get email from GitHub account');
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: githubUser.login,
          name: githubUser.name || githubUser.login,
          password: '',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;
