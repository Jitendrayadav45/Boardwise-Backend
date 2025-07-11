import { List } from "../models/list.models.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create List
export const createList = asyncHandler(async (req, res) => {
  const { title, boardid } = req.body;

  const totalLists = await List.countDocuments({ boardid });

  const newList = await List.create({
    title,
    boardid,
    position: totalLists + 1,
  });

  res.status(201).json({ message: 'List created successfully', list: newList });
});

// Get Lists by Board ID
export const getListsByBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const lists = await List.find({ boardid: boardId }).sort("position");

  res.status(200).json({ lists });
});

//  Update a List (Title, Priority, etc.)
export const updateList = asyncHandler(async (req, res) => {
  const { listId } = req.params;
  const updateFields = req.body;

  const updatedList = await List.findByIdAndUpdate(listId, updateFields, {
    new: true,
  });

  res.status(200).json({
    message: "List updated successfully",
    list: updatedList,
  });
});

// Delete a List
export const deleteList = asyncHandler(async (req, res) => {
  const { listId } = req.params;

  await List.findByIdAndDelete(listId);
  res.status(200).json({ message: "List deleted successfully" });
});