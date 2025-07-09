import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";
import { OTP } from "../models/otp.models.js";
import { Invitation } from "../models/invitation.models.js";
import { Board } from "../models/board.models.js";
import { transporter } from "../config/nodemailer.js";

const router = express.Router();

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true }
    );

    await transporter.sendMail({
      from: `"BoardWise" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your BoardWise Account - OTP Inside",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 10px;">Welcome to <span style="color: #2196F3;">BoardWise</span>!</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">
            Thank you for signing up. To complete your registration, please verify your email address using the One-Time Password (OTP) below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background: #e3f2fd; padding: 15px 25px; font-size: 30px; font-weight: bold; color: #2196F3; border-radius: 5px;">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 14px; color: #555; text-align: center;">
            This OTP is valid for the next <strong>5 minutes</strong>.
          </p>
          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
            If you did not request this email, please ignore it.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} BoardWise. All rights reserved.
          </p>
        </div>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Verify OTP and Register
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or invalid." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    await OTP.deleteOne({ email });

    // Check for pending invitations
    const pendingInvites = await Invitation.find({
      email,
      status: "pending",
    });

    for (const invite of pendingInvites) {
      await Board.findByIdAndUpdate(invite.boardId, {
        $addToSet: { members: user._id },
      });
      invite.status = "accepted";
      await invite.save();
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
