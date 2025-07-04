//  Import Dependencies

import mongoose from 'mongoose';

//  Define List Schema


const listSchema = new mongoose.Schema(
  {
    // List Title 


    title: {
      type: String,
      required: true,
      trim: true,
    },

    //  Reference to which Board this List belongs


    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board reference is required'],
    },

    // Array of Task IDs inside this List

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],

    //  Position for Left-to-Right Ordering

    position: {
      type: Number,
      required: true,
      default: 0,
    },


    //  Priority for List level


    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    // Members allowed to access/edit this list
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

 // Adds createdAt and updatedAt automatically

  {
    timestamps: true, 
  }
);

//  Export Model
export const List = mongoose.model('List', listSchema);
