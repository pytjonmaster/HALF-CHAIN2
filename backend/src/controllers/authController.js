import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser as updateUserInStore,
  deleteUser as deleteUserFromStore,
  getAllUsers as getAllUsersFromStore,
  createSession,
  findSessionByToken,
  findSessionsByUserId,
  deleteSession
} from '../store/memoryStore.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = createUser({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false,
      role: 'user'
    });

    await sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Skip email verification in development mode
    if (!user.isEmailVerified && process.env.NODE_ENV === 'production') {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user.id);

    // Create new session
    createSession({
      token,
      userId: user.id,
      device: req.headers['user-agent'] || 'Unknown',
      ip: req.ip || 'Unknown'
    });

    // Delete older sessions if more than 5 exist
    const sessions = findSessionsByUserId(user.id);
    if (sessions.length > 5) {
      const oldestSessions = sessions.slice(5);
      oldestSessions.forEach(session => deleteSession(session.token));
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const users = getAllUsersFromStore();
    const user = users.find(u => 
      u.emailVerificationToken === token && 
      u.emailVerificationExpires > new Date()
    );

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    updateUserInStore(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    updateUserInStore(user.id, {
      resetPasswordToken,
      resetPasswordExpires
    });

    await sendPasswordResetEmail(email, resetPasswordToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const users = getAllUsersFromStore();
    const user = users.find(u => 
      u.resetPasswordToken === token && 
      u.resetPasswordExpires > new Date()
    );

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    updateUserInStore(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc    Get user sessions
// @route   GET /api/auth/sessions
// @access  Private
export const getSessions = async (req, res) => {
  try {
    const sessions = findSessionsByUserId(req.user.id);
    const sessionData = sessions.map(session => ({
      id: session.id,
      device: session.device,
      ip: session.ip,
      lastActive: session.lastActive,
      createdAt: session.createdAt
    }));

    res.json(sessionData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

// @desc    Revoke a session
// @route   DELETE /api/auth/sessions/:token
// @access  Private
export const revokeSession = async (req, res) => {
  try {
    const { token } = req.params;
    
    const session = findSessionByToken(token);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    deleteSession(token);
    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error revoking session' });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = getAllUsersFromStore();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role } = req.body;
    const updatedUser = updateUserInStore(req.params.id, { name, email, role });
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    deleteUserFromStore(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// @desc    Get system statistics (Admin only)
// @route   GET /api/auth/stats
// @access  Private/Admin
export const getSystemStats = async (req, res) => {
  try {
    const users = getAllUsersFromStore();
    const allSessions = findSessionsByUserId(req.user.id);
    
    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.isEmailVerified).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      totalSessions: allSessions.length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system stats' });
  }
}; 