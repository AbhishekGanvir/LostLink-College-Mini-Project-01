import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
   {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentname: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    college_year: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    resolvedCount: {
      type: Number,
      default: 0,
    },
    unresolvedCount: {
      type: Number,
      default: 0,
    },
    lastViewedNotifications: {
      type: Date,
      default: Date.now,
    },
    notificationCount: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
 
export default User;