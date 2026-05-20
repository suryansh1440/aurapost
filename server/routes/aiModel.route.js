import express from "express";
import { createAiModel, getAiModelsByWorkspace, getAiModelById, uploadAiModelImage, deleteAiModel } from "../controllers/aiModel.controller.js";
import { protect } from "../middleware/protect.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", protect, createAiModel);
router.post("/:modelId/image", protect, upload.single('image'), uploadAiModelImage);
router.get("/workspace/:workspaceId", protect, getAiModelsByWorkspace);
router.get("/:modelId", protect, getAiModelById);
router.delete("/:modelId", protect, deleteAiModel);

export default router;
