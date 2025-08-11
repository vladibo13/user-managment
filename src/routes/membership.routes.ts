import { Router } from "express";
import { removeUserFromGroup, updateUserStatuses } from "../controllers/membership.controller";

const router = Router();

// DELETE /api/groups/:groupId/users/:userId
router.delete("/groups/:groupId/users/:userId", removeUserFromGroup);
router.patch("/users/statuses", updateUserStatuses);

export default router;
