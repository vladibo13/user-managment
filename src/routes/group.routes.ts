import { Router } from "express";
import { getGroups } from "../controllers/group.controller";
import { validatePaginationQuery } from "../middleware/validation.middleware";
import { asyncHandler } from "../utils/asynctHanlder";

const router = Router();

router.get("/groups", validatePaginationQuery, asyncHandler(getGroups));

export default router;
