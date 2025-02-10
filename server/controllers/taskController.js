const asyncHandler = require("../middlewares/asyncHandler");
const TaskService = require("../services/taskService");
const CustomError = require("../utils/customError");

// Create Task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const task = await TaskService.createTask({ title, description, dueDate, priority, userId: req.user.id });
  res.status(201).json(task);
});

// Get All Tasks (User's Tasks)
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await TaskService.getTasks(req.user);
  res.status(200).json(tasks);
});

// Get Single Task
const getTaskById = asyncHandler(async (req, res) => {
  const task = await TaskService.getTaskById(req.params.id, req.user);
  if (!task) throw new CustomError("Task not found", 404);
  res.status(200).json(task);
});

// Update Task
const updateTask = asyncHandler(async (req, res) => {
  const updatedTask = await TaskService.updateTask(req.params.id, req.body, req.user);
  res.status(200).json(updatedTask);
});

// Delete Task
const deleteTask = asyncHandler(async (req, res) => {
  await TaskService.deleteTask(req.params.id, req.user);
  res.status(204).json({ message: "Task deleted successfully" });
});

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
