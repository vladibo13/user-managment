import { Router } from "express";
import { removeUserFromGroup, updateUserStatuses } from "../controllers/membership.controller";
import { validateGroupId, validateStatusUpdate, validateUserId } from "../middleware/validation.middleware";

const router = Router();

// DELETE /api/groups/:groupId/users/:userId
router.delete("/groups/:groupId/users/:userId", validateGroupId, removeUserFromGroup);
router.patch("/users/statuses", validateStatusUpdate, updateUserStatuses);

export default router;
