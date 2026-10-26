import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, registerSchema } from '../utils/validators.js';
const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 86400000, path: '/' };
function sendSession(user, res) {
  const token = jwt.sign({ sub: user._id.toString() }, env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('task_session', token, cookieOptions);
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
}
export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Enter a name, valid email, and password with at least 8 characters.' });
  const { name, email, password } = parsed.data;
  if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  res.status(201); sendSession(user, res);
});
export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Enter a valid email and password.' });
  const user = await User.findOne({ email: parsed.data.email }).select('+passwordHash');
  const valid = user && await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Email or password is incorrect.' });
  sendSession(user, res);
});
export const currentUser = (req, res) => res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
export const logout = (req, res) => {
  res.clearCookie('task_session', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
  res.json({ message: 'You have signed out.' });
};
