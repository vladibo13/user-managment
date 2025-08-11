import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserGroup } from "../models/userGroup.model";
import { Group } from "../models/group.model";
import { UserStatus } from "../interface/userStatus.interface";
import { User } from "../models/user.model";

// helper: group status
async function recomputeGroupStatus(groupId: string) {
  const members = await UserGroup.countDocuments({ group_id: groupId });
  const status: "empty" | "notEmpty" = members === 0 ? "empty" : "notEmpty";
  await Group.updateOne({ _id: groupId }, { $set: { status } });
  return status;
}

export const removeUserFromGroup = async (req: Request, res: Response) => {
  const { userId, groupId } = req.params;

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(groupId)) {
    return res.status(400).json({ message: "Invalid userId or groupId" });
  }

  try {
    const groupDoc = await Group.findById(groupId).lean();
    if (!groupDoc) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the membership if it exists 
    const { deletedCount } = await UserGroup.deleteOne({ user_id: userId, group_id: groupId });


    if (deletedCount > 0) {
        // update group status
      const groupStatus = await recomputeGroupStatus(groupId);
      
      return res.status(200).json({
        message: "User removed from group",
        groupStatus
      });
    }

    return res.status(200).json({
      message: "No membership to remove",
      groupStatus: groupDoc.status
    });
  } catch (err) {
    console.error("removeUserFromGroup error:", err);
    return res.status(500).json({ message: "Failed to remove user from group" });
  }
};

export const updateUserStatuses = async (req: Request, res: Response) => {
  const { updates } = req.body as { updates: { userId: string; status: UserStatus }[] };

  // Validation checks
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: "No updates provided" });
  }

  if (updates.length > 500) {
    return res.status(400).json({ message: "Maximum 500 updates allowed" });
  }

  const validStatuses: UserStatus[] = ["pending", "active", "blocked"];
  
  // Validate input data
  const isValid = updates.every(update => 
    mongoose.isValidObjectId(update.userId) && 
    validStatuses.includes(update.status)
  );

  if (!isValid) {
    return res.status(400).json({ message: "Invalid user IDs or statuses provided" });
  }

  try {
    // Create bulk
    const bulkOps = updates.map(({ userId, status }) => ({
      updateOne: {
        filter: { _id: userId },
        update: { $set: { status } }
      }
    }));

    // Execute bulk update
    const result = await User.bulkWrite(bulkOps);

    return res.json({
      message: "Users updated successfully",
      updatedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (err) {
    console.error("Update users statuses error:", err);
    return res.status(500).json({ message: "Failed to update user statuses" });
  }
};