import { Router } from "express";
import { getGroups } from "../controllers/group.controller";
import { validatePaginationQuery } from "../middleware/validation.middleware";

const router = Router();

router.get("/groups", validatePaginationQuery, getGroups);

export default router;
