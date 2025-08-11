import { Schema, model, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  status: string;
  created_at: Date;
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const Group = model<IGroup>("Group", GroupSchema);