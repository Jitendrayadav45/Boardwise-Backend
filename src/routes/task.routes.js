import express from "express";
import {
  createTask,
  getTasksByList,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Create Task
router.post("/", createTask);

// Get Tasks by List
router.get("/list/:listId", getTasksByList);

// Update Task
router.put("/:taskId", updateTask);

// Delete Task
router.delete("/:taskId", deleteTask);

export default router;