const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const i18n = require('../i18n/config');
const jwt = require('jsonwebtoken');
const { env } = require('node:process');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ data: users }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.__('Internal Users error') });
  }
};

const createUser = async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: i18n.__('Email is required') });
    }
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: i18n.__('User already exists') });
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    const user = await User.create(req.body);
    return res.json({ message: 'User created', data: user }).status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.__('Internal Users error') });
  }
};

const loginUser = async (req, res) => {
  const secret = env.JWT_SECRET;
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, secret, {
      expiresIn: '30 days',
    });
    return res
      .json({
        accessToken: token,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          firstname: user.firstName,
        },
      })
      .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.__('Internal Users error') });
  }
};

// Controller to get a new access token using a refresh token
const getNewAccessToken = async (req, res) => {
  const secret = env.JWT_SECRET;
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: i18n.__('Refresh token is required') });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // If the refresh token is valid, find the user based on the id in the decoded token
      const user = await User.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate a new access token
      const newAccessToken = jwt.sign({ id: user.id }, secret, {
        expiresIn: '1h',
      });

      // Send the new access token to the client
      res.json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, getAllUsers, loginUser, getNewAccessToken };
