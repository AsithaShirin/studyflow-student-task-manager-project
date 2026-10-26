import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  dueDate: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });
taskSchema.index({ owner: 1, dueDate: 1 });
export const Task = mongoose.model('Task', taskSchema);
