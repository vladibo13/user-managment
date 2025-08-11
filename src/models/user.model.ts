import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>("User", UserSchema);