import express from "express";
import { protect } from "../middleware/protect.middleware.js";
import {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
} from "../controllers/workspace.controller.js";

import upload from "../middleware/multer.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getWorkspaces)
    .post(upload.single("workspaceLogo"), createWorkspace);

router.route("/:id")
    .get(getWorkspaceById)
    .put(upload.single("workspaceLogo"), updateWorkspace)
    .delete(deleteWorkspace);

export default router;
