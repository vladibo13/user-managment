import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { validatePaginationQuery } from "../middleware/validation.middleware";

const router = Router();

router.get("/users",validatePaginationQuery, getUsers);

export default router;