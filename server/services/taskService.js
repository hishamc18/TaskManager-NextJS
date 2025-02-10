const Task = require("../models/taskModel");
const CustomError = require("../utils/customError");

// Create Task
const createTask = async ({ title, description, dueDate, priority, userId }) => {
  return await Task.create({ title, description, dueDate, priority, user: userId });
};

// Get All Tasks
const getTasks = async (user) => {
  return user.role === "admin" ? await Task.find() : await Task.find({ user: user.id });
};

// Get Task by ID
const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new CustomError("Task not found", 404);

  if (user.role !== "admin" && task.user.toString() !== user.id) {
    throw new CustomError("Unauthorized", 403);
  }
  return task;
};

// Update Task
const updateTask = async (taskId, updates, user) => {
  let task = await Task.findById(taskId);
  if (!task) throw new CustomError("Task not found", 404);

  if (user.role !== "admin" && task.user.toString() !== user.id) {
    throw new CustomError("Unauthorized", 403);
  }

  Object.assign(task, updates);
  return await task.save();
};

// Delete Task
const deleteTask = async (taskId, user) => {
  let task = await Task.findById(taskId);
  if (!task) throw new CustomError("Task not found", 404);

  if (user.role !== "admin" && task.user.toString() !== user.id) {
    throw new CustomError("Unauthorized", 403);
  }

  await task.deleteOne();
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
