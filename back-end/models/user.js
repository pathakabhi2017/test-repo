import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      allowNull: true,
    },
    phone: {
      type: String,
      required: true,
    },
    verifyStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      allowNull: false,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
