import jwt from 'jsonwebtoken';
import { findUserById } from '../store/memoryStore.js';
import { findSessionByToken } from '../store/memoryStore.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if session exists and is valid
    const session = findSessionByToken(token);
    if (!session || session.userId !== user.id) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    // Update last active timestamp
    session.lastActive = new Date();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
}; 