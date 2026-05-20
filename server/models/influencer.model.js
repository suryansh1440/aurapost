import mongoose from "mongoose";

const { Schema, model } = mongoose;

// ─────────────────────────────────────────────
// 1. INFLUENCER SCHEMA
// ─────────────────────────────────────────────

const InfluencerSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workplace', // Referenced in workplace.model.js as "Workplace"
      required: true,
    },

    // ── Basic Info ──────────────────────────
    name:        { type: String, required: true, trim: true },
    nationality: { type: String },
    ageRange:    { type: String },
    gender:      { type: String },
    niche:       [{ type: String }],   // ['fashion', 'lifestyle', 'fitness']
    modelType:   { 
      type: String, 
      enum: ['Real Human', 'Anime', 'Cartoon', 'Eternal', 'Robot/Cybernetic', 'Fantasy', 'Dark Academia', 'Vaporwave'],
      default: 'Real Human' 
    },

    // ── Photos ──────────────────────────────
    profilePhotoUrl: { type: String },

    // ── Physical Traits ──────────────────────
    traits: {
      build:          { type: String },
      skinTone:       { type: String },
      hairLength:     { type: String },
      hairColor:      { type: String },
      hairTexture:    { type: String },
      eyeColor:       { type: String },
      makeup:         { type: String },   // 'Natural', 'Glam', etc.
      tattoos:        [{ type: String }], // ['Small rose on neck', etc.]
      facialHair:     { type: String },   // 'Stubble', 'Clean-shaven', etc.
      faceShape:      { type: String },   // 'Oval', 'Square', etc.
      attire:         [{ type: String }],   // ['Turban', 'Hijab', 'Tilak', 'None']
      uniqueFeatures: [{ type: String }],   // ['dimples', 'nose ring', 'freckles']
      clothingStyle:  { type: String },     // 'Modern Streetwear', etc.
      lighting:       { type: String },     // 'Soft Daylight', etc.
      expression:     { type: String },     // 'Neutral/Friendly', etc.
    },

    // ── Backstory & Personality ──────────────
    backstory: {
      originStory: { type: String, maxlength: 1500 },
      values:      [{ type: String }],    // ['authenticity', 'sustainability']
      interests:   [{ type: String }],    // ['coffee', 'travel', 'vintage cameras']
      lifePhase:   { type: String },
    },

    // Personality sliders — 0 (left) to 100 (right)
    sliders: {
      energy:        { type: Number, min: 0, max: 100, default: 50 }, // calm ↔ high energy
      tone:          { type: Number, min: 0, max: 100, default: 50 }, // serious ↔ playful
      aesthetic:     { type: Number, min: 0, max: 100, default: 50 }, // minimal ↔ bold
      communication: { type: Number, min: 0, max: 100, default: 50 }, // introverted ↔ extroverted
      pricePoint:    { type: Number, min: 0, max: 100, default: 50 }, // luxury ↔ street
    },

    // ── Voice ────────────────────────────────
    voice: {
      provider:   { type: String, enum: ['elevenlabs', 'preset'], default: 'preset' },
      voiceId:    { type: String },   // ElevenLabs voice_id
      voiceName:  { type: String },   // e.g. 'Aria — Warm & confident'
      previewUrl: { type: String },   // short .mp3 preview clip
      isCloned:   { type: Boolean, default: false },
    },

    // ── Caption Style ────────────────────────
    captionStyle: {
      languages:       [{ type: String }],   // ['English', 'Hindi', 'Hinglish']
      phrases:         [{ type: String }],   // ['Real talk:', 'Not gonna lie...']
      emojiUsage:      { type: String, default: 'moderate' },
      ctaStyle:        { type: String, default: 'question' },
      hashtagStrategy: { type: String, default: 'mixed' },
    },

    // ── Stats ────────────────────────────────
    stats: {
      postsGenerated: { type: Number, default: 0 },
      avgFaceScore:   { type: Number, default: 0 },   // avg consistency across all posts
      avgEngagement:  { type: Number, default: 0 },   // % from Meta Insights
    },

    completionScore: { type: Number, default: 0, min: 0, max: 100 },
    isActive:        { type: Boolean, default: true },
    isGenerating:    { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

InfluencerSchema.index({ workspaceId: 1 });

const Influencer = model('Influencer', InfluencerSchema);

export default Influencer;
