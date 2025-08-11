import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { UserGroup } from "../models/userGroup.model";

async function seed() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
  await connectDB(uri);

  // Clean
  await Promise.all([
    User.deleteMany({}),
    Group.deleteMany({}),
    UserGroup.deleteMany({})
  ]);

  // Create users
  const [john, jane] = await User.insertMany([
    { name: "John Doe",  email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" }
  ]);

  // Create groups
  const [admins, users] = await Group.insertMany([
    { name: "Admins", status: "NotEmpty" },
    { name: "Users",  status: "NotEmpty" }
  ]);

  // Link user to group (many-to-many)
  await UserGroup.insertMany([
    { user_id: john._id, group_id: admins._id },
    { user_id: jane._id, group_id: users._id }
  ]);

  console.log(" Seed complete");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(" Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
