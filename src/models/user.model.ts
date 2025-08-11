import { Schema, model, Document } from "mongoose";
import { UserStatus } from "../interface/userStatus.interface";

export interface IUser extends Document {
  name: string;
  email: string;
  created_at: Date;
  status: UserStatus;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "active", "blocked"],
    default: "pending",
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>("User", UserSchema);