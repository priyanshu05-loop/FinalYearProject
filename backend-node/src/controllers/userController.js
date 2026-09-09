import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, username, firstName, lastName, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      username,
      firstName,
      lastName,
      password,
      role: role || 'candidate',
    });

    res.status(201).json({
      message: 'User registered successfully',
      access: generateToken(user._id),
      refresh: generateToken(user._id),
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      access: generateToken(user._id),
      refresh: generateToken(user._id),
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, bio },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
