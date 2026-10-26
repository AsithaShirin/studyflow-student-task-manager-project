import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { taskSchema } from '../utils/validators.js';
export const listTasks = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = { owner: req.user._id };
  if (['pending', 'completed'].includes(req.query.status)) filter.status = req.query.status;
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ dueDate: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Task.countDocuments(filter),
  ]);
  res.json({ tasks, page, limit, total, pages: Math.ceil(total / limit) });
});
export const createTask = asyncHandler(async (req, res) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Add a title with at least 2 characters and check the other fields.' });
  const task = await Task.create({ ...parsed.data, owner: req.user._id });
  res.status(201).json({ task });
});
export const updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Task not found.' });
  const parsed = taskSchema.partial().safeParse(req.body);
  if (!parsed.success || Object.keys(parsed.data || {}).length === 0)
    return res.status(400).json({ message: 'Provide at least one valid task field.' });
  const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, parsed.data, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ task });
});
export const deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Task not found.' });
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted.' });
});
