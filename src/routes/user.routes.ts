import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { validatePaginationQuery } from "../middleware/validation.middleware";
import { asyncHandler } from "../utils/asynctHanlder";

const router = Router();

router.get("/users",validatePaginationQuery, asyncHandler(getUsers));

export default router;