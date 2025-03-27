import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      min: 13,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    subscribe: {
      type: Boolean,
      default: false,
    },
    // Streak tracking (independent from story)
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastJournaled: {
      type: Date,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    // Story tracking (independent from streak)
    storyVisitCount: {
      type: Number,
      default: 0,
    },
    storiesCompleted: {
      type: Number,
      default: 0,
    },
    lastVisited: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
