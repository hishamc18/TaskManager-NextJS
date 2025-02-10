const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.route("/task")
  .post(protect, createTask)
  .get(protect, getTasks);

router.route("/task/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
