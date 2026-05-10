import express from "express";
import { protect } from "../middleware/protect.middleware.js";
import {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace,
    inviteUser,
    updateMemberRole,
    removeMember,
    acceptInvitation,
    rejectInvitation
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

router.post("/:id/invite", inviteUser);
router.put("/:id/members/:userId", updateMemberRole);
router.delete("/:id/members/:userId", removeMember);

router.post("/invitations/:id/accept", acceptInvitation);
router.post("/invitations/:id/reject", rejectInvitation);

export default router;
