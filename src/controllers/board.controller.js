import { Board } from "../models/board.models.js";
import { User } from "../models/user.models.js";
import transporter from "../config/nodemailer.js";
import { Invitation } from "../models/invitation.models.js";

// ✅ Create Board
export const createBoard = async (req, res) => {
  try {
    const { title, description, ownerId, memberIds } = req.body;

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner user not found" });
    }

    const membersExist = await User.find({ _id: { $in: memberIds } });
    if (membersExist.length !== memberIds.length) {
      return res.status(400).json({ message: "Some members not found" });
    }

    const board = new Board({
      title,
      description,
      ownerId,
      members: memberIds,
    });

    await board.save();

    res.status(201).json({
      message: "Board created",
      board: {
        boardId: board._id,
        title: board.title,
        description: board.description,
        ownerId: board.ownerId,
        members: board.members,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Invite users to Board
export const inviteUsers = async (req, res) => {
  try {
    const { email, boardId, invitedBy } = req.body;

    const emails = Array.isArray(email) ? email : [email];

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const results = [];

    for (const singleEmail of emails) {
      const user = await User.findOne({ email: singleEmail });

      if (user) {
        if (!board.members.includes(user._id)) {
          board.members.push(user._id);
          await board.save();
        }
        results.push({
          email: singleEmail,
          message: "User exists and was added directly to the board.",
        });
      } else {
        const invitation = new Invitation({
          email: singleEmail,
          boardId,
          invitedBy,
        });

        await invitation.save();

        const link = `http://localhost:3000/register?boardId=${boardId}`;

        await transporter.sendMail({
          from: `"BoardWise" <${process.env.EMAIL_USER}>`,
          to: singleEmail,
          subject: "You’re Invited to Join a Board on BoardWise!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
              <h2 style="color: #4CAF50; text-align: center; margin-bottom: 10px;">
                Invitation to Join <span style="color: #2196F3;">BoardWise</span>!
              </h2>
              <p style="font-size: 16px; color: #333; text-align: center;">
                You've been invited to collaborate on the board:
              </p>
              <div style="background: #e3f2fd; padding: 15px; margin: 20px auto; border-radius: 5px; text-align: center;">
                <p style="font-size: 18px; font-weight: bold; color: #2196F3; margin: 0;">
                  ${board.title}
                </p>
                <p style="font-size: 14px; color: #555; margin-top: 5px;">
                  ${board.description || "No description provided."}
                </p>
              </div>
              <p style="font-size: 14px; color: #555; text-align: center;">
                Click below to join this board and start collaborating:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background: #2196F3; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold;">
                  Join Board
                </a>
              </div>
              <p style="font-size: 12px; color: #777; text-align: center;">
                If you did not expect this invitation, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                © ${new Date().getFullYear()} BoardWise. All rights reserved.
              </p>
            </div>
          `,
        });

        results.push({
          email: singleEmail,
          message: "Invitation created and email sent to new user.",
        });
      }
    }

    return res.status(201).json({
      message: "Invitations processed.",
      results,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Boards for a specific user
export const getBoardsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const boards = await Board.find({
      $or: [
        { ownerId: userId },
        { members: userId }
      ]
    });

    res.json({
      message: "Boards fetched successfully",
      boards: boards.map((board) => ({
        boardId: board._id,
        title: board.title,
        description: board.description,
        ownerId: board.ownerId,
        members: board.members,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Board
export const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, removeMembers } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (title) board.title = title;
    if (description) board.description = description;

    if (removeMembers && removeMembers.length > 0) {
      board.members = board.members.filter(
        (memberId) => !removeMembers.includes(memberId.toString())
      );
    }

    await board.save();

    return res.json({
      message: "Board updated successfully",
      board: {
        boardId: board._id,
        title: board.title,
        description: board.description,
        ownerId: board.ownerId,
        members: board.members,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Board
export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await Board.deleteOne({ _id: boardId });

    return res.json({
      message: "Board deleted successfully",
      boardId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
