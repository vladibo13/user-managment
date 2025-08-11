import { Router } from "express";
import { removeUserFromGroup, updateUserStatuses } from "../controllers/membership.controller";
import { validateGroupId, validateStatusUpdate, validateUserId } from "../middleware/validation.middleware";
import { asyncHandler } from "../utils/asynctHanlder";

const router = Router();

// DELETE /api/groups/:groupId/users/:userId
router.delete("/groups/:groupId/users/:userId", validateGroupId, asyncHandler(removeUserFromGroup));
router.patch("/users/statuses", validateStatusUpdate, asyncHandler(updateUserStatuses));

export default router;
