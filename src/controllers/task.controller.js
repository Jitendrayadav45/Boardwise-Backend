import { Task } from '../models/Task.models.js';
import asyncHandler from '../utils/asyncHandler.js';

// ✅ Create Task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, listid, boardid, priority, dueDate, members } = req.body;

  // Count existing tasks in the list for positioning
  const totalTasks = await Task.countDocuments({ listid });

  const newTask = await Task.create({
    title,
    description,
    listid,
    boardid,
    priority,
    dueDate,
    members,
    position: totalTasks + 1,
  });

  res.status(201).json({ message: 'Task created successfully', task: newTask });
});

// ✅ Get All Tasks by List ID
export const getTasksByList = asyncHandler(async (req, res) => {
  const { listId } = req.params;

  const tasks = await Task.find({ listid: listId }).populate('members', 'name email');
  res.json({ tasks });
});

// ✅ Update Task by ID
export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
    new: true,
  });

  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task updated', task: updatedTask });
});

// ✅ Delete Task by ID
export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deletedTask = await Task.findByIdAndDelete(taskId);

  if (!deletedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully' });
});
