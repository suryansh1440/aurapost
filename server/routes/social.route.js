import express from "express";
import { protect } from "../middleware/protect.middleware.js";
import { connectMetaAccount, getConnectedAccounts, selectMetaPage, disconnectAccount } from "../controllers/social.controller.js";

const router = express.Router();

router.use(protect);

router.post("/meta/connect", connectMetaAccount);
router.post("/meta/select-page", selectMetaPage);
router.get("/workspace/:workspaceId", getConnectedAccounts);
router.delete("/:integrationId", disconnectAccount);

export default router;
