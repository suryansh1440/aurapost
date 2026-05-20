import express from "express";
import { createOutfit, getOutfitsByInfluencer, deleteOutfit } from "../controllers/outfit.controller.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createOutfit);
router.get("/influencer/:influencerId", getOutfitsByInfluencer);
router.delete("/:outfitId", deleteOutfit);

export default router;
