import { Schema, model, Document, Types } from "mongoose";

export interface IUserGroup extends Document {
  user_id: Types.ObjectId;
  group_id: Types.ObjectId;
}

const UserGroupSchema = new Schema<IUserGroup>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  group_id: { type: Schema.Types.ObjectId, ref: "Group", required: true }
});

// Prevent duplicates like a composite PK (user_id, group_id)
UserGroupSchema.index({ user_id: 1, group_id: 1 }, { unique: true });

export const UserGroup = model<IUserGroup>("UserGroup", UserGroupSchema);
