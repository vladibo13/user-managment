import { NextFunction, Request, Response } from "express";
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

export const removeUserFromGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, groupId } = req.params;

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
    next(err);
  }
};

export const updateUserStatuses = async (req: Request, res: Response, next: NextFunction) => {
  const { updates } = req.body as { updates: { userId: string; status: UserStatus }[] };

  if (updates.length > 500) {
    return res.status(400).json({ message: "Maximum 500 updates allowed" });
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
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: "No users were updated",
        matchedCount: result.matchedCount
      });
    }
    
    return res.json({
      message: "Users updated successfully",
      updatedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (err) {
   next(err);
  }
};