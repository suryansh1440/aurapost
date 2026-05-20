import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OutfitSchema = new Schema(
  {
    workspaceId:  {
      type: Schema.Types.ObjectId,
      ref: 'Workplace',
      required: true,
    },
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: 'Influencer',
      required: true,
    },

    // ── Images ───────────────────────────────
    photoUrl:     { type: String, required: true },   // full image (R2/S3)

    // ── Usage Tracking ───────────────────────
    usageCount: { type: Number, default: 0 },   // how many posts used this outfit
    lastUsedAt: { type: Date },

    canBeRemoved: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isGenerating: { type: Boolean, default: false },
    isFailed: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

OutfitSchema.index({ influencerId: 1 });
OutfitSchema.index({ workspaceId: 1 });
OutfitSchema.index({ influencerId: 1, usageCount: 1 });   // for "least used first" selection

const Outfit = model('Outfit', OutfitSchema);

export default Outfit;
