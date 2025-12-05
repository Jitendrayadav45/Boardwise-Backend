import express from "express";
import {
  createBoard,
  inviteUsers,
  getBoardsByUser,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";

const router = express.Router();

router.post("/create", createBoard);
router.post("/invite", inviteUsers);
router.get("/:userId", getBoardsByUser);
router.patch("/update/:boardId", updateBoard);
router.delete("/delete/:boardId", deleteBoard);

export default router;
