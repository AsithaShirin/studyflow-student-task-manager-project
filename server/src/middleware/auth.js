import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.task_session;
  if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) return res.status(401).json({ message: 'Please sign in again.' });
    req.user = user; next();
  } catch {
    return res.status(401).json({ message: 'Your session expired. Please sign in again.' });
  }
});
