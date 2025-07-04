//  Import Dependencies

import mongoose from 'mongoose';

// Define Task Schema

const taskSchema = new mongoose.Schema(
  {
    //  Task Title

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Task Description

    description: {
      type: String,
      default: '',
      trim: true,
    },

    // List where this task exists

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: true,
    },

    // Board where this task exists

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },

    //  Members assigned to this task

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    //  Priority of the task

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    //  Due Date for the task

    dueDate: {
      type: Date,
    },

    //  Task status

    status: {
      type: String,
      enum: ['Incomplete', 'Complete'],
      default: 'Incomplete',
    },

    //  File attachments

    attachments: [
      {
        type: String, // You can store file URLs or file IDs
      },
    ],

    //  Position for ordering inside list

    position: {
      type: Number,
      default: 0,
    },

    //  Comments

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  // Adds createdAt and updatedAt automatically

  {
    timestamps: true, 
  }
);

//  Export the model
export const Task = mongoose.model('Task', taskSchema);
