import express from "express";
import {
  createList,
  getListsByBoard,
  updateList,
  deleteList,
} from "../controllers/list.controller.js";

const router = express.Router();

// Create List
router.post("/", createList);

// Get Lists by Board
router.get("/:boardId", getListsByBoard);

// Update List
router.put("/:listId", updateList);

// Delete List
router.delete("/:listId", deleteList);

export default router;