import { Router } from "express";
import { getGroups } from "../controllers/group.controller";

const router = Router();

router.get("/groups", getGroups);

export default router;
