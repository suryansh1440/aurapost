import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAiModelStore } from "../../../store/aiModelStore";
import { Icons } from "../../../utils/dashboardData";

// ── Data ──────────────────────────────────────────────────────────────────────

const NICHES = {
  universal: ["Fashion", "Lifestyle", "Travel", "Food & Dining", "Art & Design", "Music", "Wellness", "Education"],
  female:    ["Beauty & Makeup", "Skincare", "Mom Life", "Wedding & Bridal", "Lingerie & Body Confidence"],
  male:      ["Fitness & Bodybuilding", "Gaming", "Tech & Gadgets", "Cars & Motorsport", "Streetwear & Sneakers", "Sports"],
  nonbinary: ["Gender-Fluid Fashion", "LGBTQ+ Advocacy", "Alternative Culture"]
};

const MODEL_TYPES = [
  { id: "Real Human",     emoji: "👤", desc: "Photorealistic, 8K render" },
  { id: "Anime",          emoji: "✨", desc: "Vibrant Japanese illustration" },
  { id: "Cartoon",        emoji: "🎨", desc: "3D Pixar/Disney aesthetic" },
  { id: "Eternal",        emoji: "🌙", desc: "Mystical, divine, ethereal" },
  { id: "Robot/Cybernetic", emoji: "🤖", desc: "Android & cyborg fusion" },
  { id: "Fantasy",        emoji: "🐉", desc: "Elves, orcs, magical beings" },
  { id: "Dark Academia",  emoji: "📚", desc: "Gothic scholar aesthetic" },
  { id: "Vaporwave",      emoji: "🌅", desc: "Retro-futuristic neon vibes" },
];

const AGE_RANGES = ["18-21", "22-26", "27-32", "33-40", "40-50", "50+"];

const BUILDS = {
  female:    ["Petite", "Slim", "Athletic", "Hourglass", "Curvy", "Plus-Size", "Tall & Lean", "Pear-Shaped"],
  male:      ["Slim", "Athletic", "Muscular", "Bulky/Powerlifter", "Lean & Toned", "Tall & Lanky", "Average", "Stocky"],
  nonbinary: ["Androgynous", "Slim", "Athletic", "Curvy", "Average", "Non-conforming Silhouette"]
};

const HAIR_LENGTHS = {
  female:    ["Bald/Shaved", "Buzz Cut", "Pixie", "Bob", "Shoulder-Length", "Long", "Very Long", "Floor-Length", "Waist-Length"],
  male:      ["Bald/Shaved", "Buzz Cut", "Short Crop", "Caesar Cut", "Medium Length", "Man Bun Ready", "Long Flowing", "Mohawk"],
  nonbinary: ["Bald/Shaved", "Buzz Cut", "Pixie", "Bob", "Shoulder-Length", "Long", "Asymmetric", "Undercut"]
};

const HAIR_TEXTURES = ["Silky Straight", "Loose Waves", "Beach Waves", "Deep Waves", "Loose Curls", "Tight Curls", "Coily/4C", "Afro", "Dreadlocks", "Braided", "Cornrows", "Box Braids", "Spiky", "Slicked Back", "Anime Spikes"];

const HAIR_COLORS = [
  // Natural
  "Jet Black", "Soft Black", "Dark Brown", "Chestnut Brown", "Medium Brown", "Caramel Brown", "Auburn", "Copper Red", "Strawberry Blonde", "Dirty Blonde", "Golden Blonde", "Platinum Blonde", "Silver/Grey", "Pure White",
  // Trending
  "Midnight Blue", "Navy Blue", "Electric Blue", "Ice Blue", "Teal", "Emerald Green", "Forest Green", "Mint Green", "Lavender", "Lilac Purple", "Deep Purple", "Violet", "Magenta", "Hot Pink", "Rose Pink", "Peach", "Coral", "Burnt Orange", "Rust Red", "Cherry Red", "Crimson",
  // Fantasy
  "Holographic Silver", "Rose Gold", "Galaxy (Purple-Blue Mix)", "Ombre Black to Red", "Rainbow", "Pastel Rainbow", "Two-Tone Split", "Bleached Roots", "Dark Roots Blonde", "Ashen Lilac"
];

const EYE_COLORS = [
  // Natural
  "Dark Brown", "Medium Brown", "Hazel", "Amber", "Olive Green", "Forest Green", "Teal Green", "Steel Blue", "Sky Blue", "Ice Blue", "Stormy Grey", "Dark Grey",
  // Rare/Fantasy
  "Violet", "Lilac", "Deep Purple", "Magenta", "Crimson Red", "Glowing Orange", "Golden Yellow", "Heterochromia (Blue+Brown)", "Heterochromia (Green+Grey)", "Kaleidoscope", "Silver Mercury", "Glowing Cyan", "Pitch Black", "White (Albino)", "Cat-Slit Pupils", "Star-Shaped Iris"
];

const SKIN_TONES = [
  "Porcelain White", "Fair/Light", "Ivory", "Peach", "Beige", "Warm Fair", "Wheatish", "Light Brown", "Tan", "Golden Tan", "Olive", "Caramel", "Medium Brown", "Warm Brown", "Deep Brown", "Ebony",
  // Fantasy
  "Pale Blue (Elven)", "Ice White (Arctic)", "Midnight Black (Fantasy)", "Deep Purple (Dark Elf)", "Metallic Gold", "Titanium Silver (Android)"
];

const CLOTHING_STYLES = {
  female:    ["Soft Feminine", "Dark Feminine", "Old Money Elegance", "Y2K Revival", "Cottagecore", "Balletcore", "Coquette", "Mob Wife Aesthetic", "Quiet Luxury", "Dopamine Dressing", "Avant-Garde", "Athleisure Chic", "Streetwear Femme", "Boho Festival", "Preppy Academia", "Grunge Glam", "Business Femme", "Bikini/Swimwear", "Traditional Indian Ethnic"],
  male:      ["Clean Boy Aesthetic", "Dark Academia", "Old Money Classic", "Streetwear Hypebeast", "Techwear", "Workwear/Gorpcore", "Punk Rock", "Business Casual", "Formal Black Tie", "Gym Bro", "Skater", "Preppy", "Military Inspired", "Resort/Beach", "Traditional Kurta/Sherwani"],
  nonbinary: ["Gender-Fluid Chic", "Androgynous High Fashion", "Soft Grunge", "Avant-Garde Couture", "Maximalist Eclectic", "Minimalist Neutral", "Artsy Bohemian"]
};

const MAKEUP_STYLES = {
  female:    ["No Makeup Makeup", "Glass Skin Natural", "Soft Glam", "Full Glam", "Old Hollywood", "Y2K Glossy", "Smoky Eye", "Cut Crease", "Dewy Skin", "Editorial Bold", "Gothic Dark", "Cyberpunk Neon", "E-Girl", "Witch Dark", "Bridal Glow", "Festival Glitter", "Anime Eyes"],
  nonbinary: ["No Makeup Makeup", "Subtle Pop", "Editorial Abstract", "Androgynous Liner", "Gothic", "Fantasy Art"],
};

const FACIAL_HAIR = {
  universal: ["None", "Clean Shaven", "Five O'Clock Shadow", "Light Stubble", "Heavy Stubble"],
  male:      ["Chinstrap", "Goatee", "Anchor Beard", "Short Boxed Beard", "Full Beard", "Long Yeard Beard", "Viking Beard", "Handlebar Mustache", "French Mustache", "Soul Patch", "Mutton Chops", "Van Dyke Beard", "Imperial Mustache", "Petit Goatee"],
  female:    ["None", "Subtle Peach Fuzz", "Fine Facial Hair"],
  nonbinary: ["Thin Mustache", "Styled Goatee", "Designer Stubble"],
};

const FACE_SHAPES = ["Neutral", "Oval", "Round", "Square", "Heart", "Diamond", "Long/Oblong", "Chiseled/Angular", "Soft Rounded", "Sharp V-Line"];

const ATTIRE_OPTIONS = {
  female:    ["None", "Hijab", "Niqab", "Bindi", "Mangalsutra", "Bangles", "Nose Ring", "Earrings (Studs)", "Hoop Earrings", "Statement Necklace", "Choker", "Hair Crown/Tiara", "Halo (Eternal)", "Cybernetic Implant", "Elf Ears", "Flower Crown"],
  male:      ["None", "Turban", "Tilak", "Kippah", "Cross Necklace", "Chain", "Earrings", "Bandana", "Snapback Cap", "Beanie", "Cybernetic Implant", "Elf Ears", "Eye Patch", "Glasses"],
  nonbinary: ["None", "Hijab", "Bindi", "Nose Ring", "Earrings", "Chain", "Choker", "Cybernetic Implant", "Elf Ears", "Hair Crown", "Halo", "Bandana"]
};

const TATTOO_OPTIONS = ["None", "Sleeve Tattoo (Arm)", "Neck Tattoo", "Hand/Knuckle Tattoos", "Face Tattoo", "Chest Tattoo", "Back Tattoo", "Thigh Tattoo", "Ankle Tattoo", "Collarbone Script", "Mandala Shoulder", "Rose Neck", "Barbed Wire Arm", "Tribal Pattern", "Japanese Koi", "Geometric Abstract"];

const UNIQUE_FEATURES = {
  female:    ["None", "Dimples", "Freckles", "Vitiligo", "Birthmark", "Mole (Beauty Mark)", "Scar (Subtle)", "Heterochromia", "Full Lips", "High Cheekbones", "Monolid Eyes", "Winged Ears (Elf)", "Pointy Chin", "Soft Jawline", "Cat-Like Eyes"],
  male:      ["None", "Jawline Definition", "Dimples", "Freckles", "Heterochromia", "Scar", "Vitiligo", "Birthmark", "Strong Brow Ridge", "Square Jaw", "Soft Features", "Sharp Cheekbones", "Cleft Chin", "Winged Ears (Elf)"],
  nonbinary: ["None", "Dimples", "Freckles", "Vitiligo", "Birthmark", "Mole", "Scar", "Heterochromia", "Soft Androgynous Features", "Pointed Ears (Elf)", "Striking Eye Shape"]
};

const LIGHTING_OPTIONS = ["Soft Daylight", "Golden Hour Glow", "Blue Hour Dusk", "Studio Ring Light", "Cinematic Side Light", "Neon City Glow", "Dramatic Rembrandt", "Candlelight Warmth", "Cyberpunk Neon", "Ethereal Soft Light", "Moonlight Glow", "Sunset Backlight", "High-Key White Studio", "Low-Key Noir", "Underwater Caustics"];

const EXPRESSION_OPTIONS = {
  female:    ["Natural/Relaxed", "Confident Smile", "Warm Genuine Smile", "Soft Smirk", "Playful Pout", "Coy/Mysterious", "Fierce & Intense", "Dreamy Far-Off Look", "Joyful Laugh", "Kawaii Bright Eyes", "Pensive Thinking", "Sultry Gaze", "Power Pose"],
  male:      ["Natural/Relaxed", "Confident Smirk", "Genuine Laugh", "Serious & Intense", "Stoic / No Expression", "Brooding Thinker", "Determined Jaw Set", "Warm Friendly Smile", "Cocky Grin", "Mysterious Half-Smile", "Powerful/Dominant"],
  nonbinary: ["Natural/Relaxed", "Soft Smile", "Confident Smirk", "Mysterious", "Playful", "Dreamy", "Intense", "Joyful", "Pensive"]
};

const CAPTION_LANGUAGES = ["English", "Hindi", "Hinglish", "Spanish", "French", "Arabic", "Japanese", "Korean", "Portuguese", "German", "Italian"];
const EMOJI_STYLES = ["none", "minimal", "moderate", "heavy", "emoji-only"];
const CTA_STYLES = ["question", "follow", "link-in-bio", "comment-below", "save-this", "share", "collab", "none"];
const HASHTAG_STYLES = ["broad", "niche", "mixed", "trending-only", "none"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const genderKey = (gender) => {
  if (gender === "Male") return "male";
  if (gender === "Female") return "female";
  return "nonbinary";
};

const Tag = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: active ? "rgba(57,255,20,0.12)" : "rgba(255,255,255,0.04)",
      border: active ? "1px solid #39ff14" : "1px solid rgba(255,255,255,0.08)",
      color: active ? "#39ff14" : "rgba(255,255,255,0.45)",
      fontWeight: active ? 600 : 400,
    }}
  >
    {label}
  </button>
);

const ColorTag = ({ color, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={color}
    style={{
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: active ? "rgba(57,255,20,0.12)" : "rgba(255,255,255,0.04)",
      border: active ? "1px solid #39ff14" : "1px solid rgba(255,255,255,0.08)",
      color: active ? "#39ff14" : "rgba(255,255,255,0.45)",
      fontWeight: active ? 600 : 400,
    }}
  >
    {color}
  </button>
);

const AddTagButton = ({ onAdd, placeholder = "Add custom..." }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  if (isEditing) {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        background: "rgba(57,255,20,0.12)",
        border: "1px solid #39ff14",
        borderRadius: "20px",
        padding: "5px 12px",
      }}>
        <input 
          autoFocus
          className="custom-tag-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.trim()) {
                onAdd(value.trim());
                setValue("");
                setIsEditing(false);
              }
            } else if (e.key === "Escape") {
              setIsEditing(false);
            }
          }}
          onBlur={() => {
             if (value.trim()) onAdd(value.trim());
             setValue("");
             setIsEditing(false);
          }}
          placeholder={placeholder}
          style={{
            background: "transparent",
            border: "none",
            color: "#39ff14",
            outline: "none",
            fontSize: "12px",
            width: "90px",
            padding: 0
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,0.45)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px"
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Custom
    </button>
  );
};

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {label && <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff",
        borderRadius: 10,
        padding: "11px 14px",
        fontSize: 13,
        outline: "none",
        cursor: "pointer",
        width: "100%",
      }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: "#12101e" }}>{o}</option>)}
    </select>
  </div>
);

const Slider = ({ label, left, right, value, onChange }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 11, color: "#39ff14" }}>{value}%</span>
    </div>
    <input
      type="range" min={0} max={100} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: "#39ff14", cursor: "pointer" }}
    />
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{left}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{right}</span>
    </div>
  </div>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{sub}</p>}
  </div>
);

const Card = ({ selected, onClick, children, style = {} }) => (
  <div
    onClick={onClick}
    style={{
      padding: "1rem",
      borderRadius: 12,
      cursor: "pointer",
      background: selected ? "rgba(57,255,20,0.06)" : "rgba(255,255,255,0.02)",
      border: selected ? "1px solid #39ff14" : "1px solid rgba(255,255,255,0.07)",
      transition: "all 0.25s ease",
      ...style,
    }}
  >
    {children}
  </div>
);

const FormSection = ({ title, children }) => (
  <div style={{ marginTop: "1.5rem" }}>
    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10, fontWeight: 600 }}>{title}</p>
    {children}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const WsAiModelGenerate = () => {
  const { wsId } = useParams?.() ?? { wsId: "demo" };
  const navigate = useNavigate?.() ?? { navigate: () => {} };
  const { createAiModel, isLoading: isGenerating } = useAiModelStore();

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 8;

  const [form, setForm] = useState({
    generationMethod: "ai",
    name: "",
    nationality: "Indian",
    ageRange: "22-26",
    gender: "Female",
    modelType: "Real Human",
    niche: [],
    traits: {
      build: "Slim",
      skinTone: "Wheatish",
      hairLength: "Long",
      hairTexture: "Loose Waves",
      hairColor: "Jet Black",
      eyeColor: "Dark Brown",
      clothingStyle: "Soft Feminine",
      makeup: "Glass Skin Natural",
      facialHair: "None",
      faceShape: "Neutral",
      tattoos: [],
      attire: [],
      uniqueFeatures: [],
      lighting: "Soft Daylight",
      expression: "Natural/Relaxed",
    },
    sliders: { energy: 50, tone: 50, aesthetic: 50, communication: 50, pricePoint: 50 },
    backstory: { originStory: "", values: [], interests: [], lifePhase: "" },
    captionStyle: {
      languages: ["English"],
      phrases: [],
      emojiUsage: "moderate",
      ctaStyle: "question",
      hashtagStrategy: "mixed",
    },
  });

  const gk = genderKey(form.gender);

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const updateTrait = (key, val) => setForm(f => ({ ...f, traits: { ...f.traits, [key]: val } }));
  const updateSlider = (key, val) => setForm(f => ({ ...f, sliders: { ...f.sliders, [key]: val } }));
  const updateBackstory = (key, val) => setForm(f => ({ ...f, backstory: { ...f.backstory, [key]: val } }));
  const updateCaption = (key, val) => setForm(f => ({ ...f, captionStyle: { ...f.captionStyle, [key]: val } }));

  const toggleArr = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  // Reset gender-specific fields when gender changes
  const handleGenderChange = (g) => {
    const newGk = genderKey(g);
    updateForm("gender", g);
    setForm(f => ({
      ...f,
      gender: g,
      traits: {
        ...f.traits,
        build: (BUILDS[newGk] || BUILDS.nonbinary)[0],
        hairLength: (HAIR_LENGTHS[newGk] || HAIR_LENGTHS.nonbinary)[0],
        clothingStyle: (CLOTHING_STYLES[newGk] || CLOTHING_STYLES.nonbinary)[0],
        makeup: newGk === "male" ? "" : "Glass Skin Natural",
        facialHair: "None",
        faceShape: "Neutral",
        attire: [],
        uniqueFeatures: [],
        expression: (EXPRESSION_OPTIONS[newGk] || EXPRESSION_OPTIONS.nonbinary)[0],
      }
    }));
  };

  const availableNiches = [
    ...NICHES.universal,
    ...(NICHES[gk] || [])
  ];

  const steps = [
    "Method", "Identity", "Style", "Appearance", "Details", "Personality", "Backstory", "Captions"
  ];

  const handleSubmit = async () => {
    try {
      await createAiModel({
        workspaceId: wsId,
        ...form
      });
      navigate(`/dashboard/workspaces/${wsId}/ai-models`);
    } catch (error) {
      console.error("Failed to generate model:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      // ── Step 1: Method ──────────────────────────────────────────────────────
      case 1:
        return (
          <>
            <SectionTitle title="Creation Method" sub="How would you like to build your AI Persona?" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card selected={form.generationMethod === "ai"} onClick={() => updateForm("generationMethod", "ai")}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>AI Generation</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Neural engine crafts a unique high-fidelity persona from your traits. Includes AI-generated profile photo.</p>
                <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Photo", "Prompt", "Instant"].map(t => (
                    <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: "rgba(57,255,20,0.1)", color: "#39ff14" }}>{t}</span>
                  ))}
                </div>
              </Card>
              <Card selected={form.generationMethod === "manual"} onClick={() => updateForm("generationMethod", "manual")}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📁</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Manual Upload</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Build the data profile now and upload your own reference photos later from the dashboard.</p>
                <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Custom Photo", "Your Control"].map(t => (
                    <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>{t}</span>
                  ))}
                </div>
              </Card>
            </div>
          </>
        );

      // ── Step 2: Identity ────────────────────────────────────────────────────
      case 2:
        return (
          <>
            <SectionTitle title="Core Identity" sub="Define the foundation of your AI persona." />

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Persona Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateForm("name", e.target.value)}
                placeholder="e.g. Aanya, Zara, Rohan, Kai…"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", width: "100%" }}
              />
            </div>

            <FormSection title="Gender">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Female", "Male", "Non-binary"].map(g => (
                  <Tag key={g} label={g} active={form.gender === g} onClick={() => handleGenderChange(g)} />
                ))}
              </div>
            </FormSection>

            <FormSection title="Age Range">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {AGE_RANGES.map(a => (
                  <Tag key={a} label={a} active={form.ageRange === a} onClick={() => updateForm("ageRange", a)} />
                ))}
              </div>
            </FormSection>

            <FormSection title="Nationality">
              <input
                type="text"
                value={form.nationality}
                onChange={e => updateForm("nationality", e.target.value)}
                placeholder="e.g. Indian, Korean, Brazilian, Nigerian…"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", width: "100%" }}
              />
            </FormSection>

            <FormSection title={`Niche / Categories — Curated for ${form.gender}`}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set([...availableNiches, ...form.niche])].map(n => (
                  <Tag key={n} label={n} active={form.niche.includes(n)} onClick={() => updateForm("niche", toggleArr(form.niche, n))} />
                ))}
                <AddTagButton onAdd={val => !form.niche.includes(val) && updateForm("niche", [...form.niche, val])} />
              </div>
            </FormSection>
          </>
        );

      // ── Step 3: Style ───────────────────────────────────────────────────────
      case 3:
        return (
          <>
            <SectionTitle title="Artistic Direction" sub="Choose the visual style universe your persona lives in." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {MODEL_TYPES.map(type => (
                <Card key={type.id} selected={form.modelType === type.id} onClick={() => updateForm("modelType", type.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 26 }}>{type.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{type.id}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{type.desc}</div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        );

      // ── Step 4: Appearance ──────────────────────────────────────────────────
      case 4:
        return (
          <>
            <SectionTitle title="Physical Appearance" sub={`Crafting traits for a ${form.modelType} ${form.gender} persona.`} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Select label="Body Build" value={form.traits.build} options={BUILDS[gk] || BUILDS.nonbinary} onChange={v => updateTrait("build", v)} />
              <Select label="Skin Tone" value={form.traits.skinTone} options={SKIN_TONES} onChange={v => updateTrait("skinTone", v)} />
              <Select label="Face Shape" value={form.traits.faceShape} options={FACE_SHAPES} onChange={v => updateTrait("faceShape", v)} />
            </div>

            <FormSection title="Hair Color — Natural & Fantasy">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, maxHeight: 160, overflowY: "auto", paddingRight: 4 }}>
                {[...new Set([...HAIR_COLORS, form.traits.hairColor])].filter(Boolean).map(c => (
                  <ColorTag key={c} color={c} active={form.traits.hairColor === c} onClick={() => updateTrait("hairColor", c)} />
                ))}
                <AddTagButton onAdd={val => updateTrait("hairColor", val)} />
              </div>
            </FormSection>

            <FormSection title="Hair Length & Texture">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Select label="Length" value={form.traits.hairLength} options={HAIR_LENGTHS[gk] || HAIR_LENGTHS.nonbinary} onChange={v => updateTrait("hairLength", v)} />
                <Select label="Texture / Style" value={form.traits.hairTexture} options={HAIR_TEXTURES} onChange={v => updateTrait("hairTexture", v)} />
              </div>
            </FormSection>

            <FormSection title="Eye Color — Natural & Fantasy">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, maxHeight: 130, overflowY: "auto", paddingRight: 4 }}>
                {[...new Set([...EYE_COLORS, form.traits.eyeColor])].filter(Boolean).map(c => (
                  <ColorTag key={c} color={c} active={form.traits.eyeColor === c} onClick={() => updateTrait("eyeColor", c)} />
                ))}
                <AddTagButton onAdd={val => updateTrait("eyeColor", val)} />
              </div>
            </FormSection>
          </>
        );

      // ── Step 5: Stylization Details ─────────────────────────────────────────
      case 5:
        return (
          <>
            <SectionTitle title="Style & Details" sub="Fine-tune aesthetics, accessories, and vibe." />

            <Select
              label={`Clothing Style — Curated for ${form.gender}`}
              value={form.traits.clothingStyle}
              options={CLOTHING_STYLES[gk] || CLOTHING_STYLES.nonbinary}
              onChange={v => updateTrait("clothingStyle", v)}
            />

            {gk !== "male" && (
              <FormSection title="Makeup Aesthetic">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[...new Set([...(MAKEUP_STYLES[gk] || MAKEUP_STYLES.nonbinary), form.traits.makeup])].filter(Boolean).map(m => (
                    <Tag key={m} label={m} active={form.traits.makeup === m} onClick={() => updateTrait("makeup", m)} />
                  ))}
                  <AddTagButton onAdd={val => updateTrait("makeup", val)} />
                </div>
              </FormSection>
            )}

            <FormSection title="Facial Hair">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set([...FACIAL_HAIR.universal, ...(FACIAL_HAIR[gk] || []), form.traits.facialHair])].filter(Boolean).map(f => (
                  <Tag key={f} label={f} active={form.traits.facialHair === f} onClick={() => updateTrait("facialHair", f)} />
                ))}
                <AddTagButton onAdd={val => updateTrait("facialHair", val)} />
              </div>
            </FormSection>

            <FormSection title={`Accessories & Culture — ${form.gender}`}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set([...(ATTIRE_OPTIONS[gk] || ATTIRE_OPTIONS.nonbinary), ...form.traits.attire])].map(a => (
                  <Tag key={a} label={a}
                    active={a === "None" ? form.traits.attire.length === 0 : form.traits.attire.includes(a)}
                    onClick={() => {
                      if (a === "None") updateTrait("attire", []);
                      else updateTrait("attire", toggleArr(form.traits.attire.filter(x => x !== "None"), a));
                    }} />
                ))}
                <AddTagButton onAdd={val => !form.traits.attire.includes(val) && updateTrait("attire", [...form.traits.attire.filter(x => x !== "None"), val])} />
              </div>
            </FormSection>

            <FormSection title="Tattoos">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set([...TATTOO_OPTIONS, ...form.traits.tattoos])].map(t => (
                  <Tag key={t} label={t}
                    active={t === "None" ? form.traits.tattoos.length === 0 : form.traits.tattoos.includes(t)}
                    onClick={() => {
                      if (t === "None") updateTrait("tattoos", []);
                      else updateTrait("tattoos", toggleArr(form.traits.tattoos.filter(x => x !== "None"), t));
                    }} />
                ))}
                <AddTagButton onAdd={val => !form.traits.tattoos.includes(val) && updateTrait("tattoos", [...form.traits.tattoos.filter(x => x !== "None"), val])} />
              </div>
            </FormSection>

            <FormSection title={`Unique Features — ${form.gender}`}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set([...(UNIQUE_FEATURES[gk] || UNIQUE_FEATURES.nonbinary), ...form.traits.uniqueFeatures])].map(u => (
                  <Tag key={u} label={u}
                    active={u === "None" ? form.traits.uniqueFeatures.length === 0 : form.traits.uniqueFeatures.includes(u)}
                    onClick={() => {
                      if (u === "None") updateTrait("uniqueFeatures", []);
                      else updateTrait("uniqueFeatures", toggleArr(form.traits.uniqueFeatures.filter(x => x !== "None"), u));
                    }} />
                ))}
                <AddTagButton onAdd={val => !form.traits.uniqueFeatures.includes(val) && updateTrait("uniqueFeatures", [...form.traits.uniqueFeatures.filter(x => x !== "None"), val])} />
              </div>
            </FormSection>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: "1rem" }}>
              <Select label="Lighting Mood" value={form.traits.lighting} options={LIGHTING_OPTIONS} onChange={v => updateTrait("lighting", v)} />
              <Select
                label={`Expression — ${form.gender}`}
                value={form.traits.expression}
                options={EXPRESSION_OPTIONS[gk] || EXPRESSION_OPTIONS.nonbinary}
                onChange={v => updateTrait("expression", v)}
              />
            </div>
          </>
        );

      // ── Step 6: Personality Sliders ─────────────────────────────────────────
      case 6:
        return (
          <>
            <SectionTitle title="Personality Profile" sub="Tune how your persona behaves, sounds, and presents." />
            <div style={{ display: "grid", gap: 28 }}>
              <Slider label="Energy Level" left="Calm & Chill" right="High Energy" value={form.sliders.energy} onChange={v => updateSlider("energy", v)} />
              <Slider label="Communication Tone" left="Serious & Professional" right="Playful & Witty" value={form.sliders.tone} onChange={v => updateSlider("tone", v)} />
              <Slider label="Visual Aesthetic" left="Clean Minimalist" right="Bold Maximalist" value={form.sliders.aesthetic} onChange={v => updateSlider("aesthetic", v)} />
              <Slider label="Social Style" left="Reserved / Introverted" right="Loud / Extroverted" value={form.sliders.communication} onChange={v => updateSlider("communication", v)} />
              <Slider label="Price Point Vibe" left="Luxury & High-End" right="Streetwear / Mass Market" value={form.sliders.pricePoint} onChange={v => updateSlider("pricePoint", v)} />
            </div>
          </>
        );

      // ── Step 7: Backstory ───────────────────────────────────────────────────
      case 7:
        return (
          <>
            <SectionTitle title="Backstory & Character" sub="Give your persona a soul — this feeds the AI content engine." />

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Origin Story</label>
              <textarea
                value={form.backstory.originStory}
                onChange={e => updateBackstory("originStory", e.target.value)}
                placeholder={`e.g. ${form.name || "Aanya"} grew up in ${form.nationality} but found her voice through social media…`}
                rows={5}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "12px 14px", fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.7, width: "100%" }}
              />
            </div>

            <FormSection title="Life Phase">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[...new Set(["Student Life", "Early Career", "Entrepreneur", "Creative / Artist", "Traveler", "Parent", "Established Professional", "Retired / Elder", "Activist", form.backstory.lifePhase])].filter(Boolean).map(lp => (
                  <Tag key={lp} label={lp} active={form.backstory.lifePhase === lp} onClick={() => updateBackstory("lifePhase", lp)} />
                ))}
                <AddTagButton onAdd={val => updateBackstory("lifePhase", val)} />
              </div>
            </FormSection>

            <FormSection title="Core Values">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set(["Authenticity", "Sustainability", "Empowerment", "Creativity", "Adventure", "Family", "Community", "Luxury", "Minimalism", "Hustle", "Balance", "Spirituality", "Innovation", "Freedom", "Love", ...(form.backstory.values || [])])].map(v => (
                  <Tag key={v} label={v} active={(form.backstory.values || []).includes(v)} onClick={() => updateBackstory("values", toggleArr(form.backstory.values || [], v))} />
                ))}
                <AddTagButton onAdd={val => !(form.backstory.values || []).includes(val) && updateBackstory("values", [...(form.backstory.values || []), val])} />
              </div>
            </FormSection>

            <FormSection title="Interests & Passions">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set(["Coffee", "Yoga", "Vintage Cameras", "Street Art", "Crypto", "K-Drama", "Anime", "Hiking", "Cooking", "Books", "Nightlife", "Cafes", "Gaming", "Music Production", "Cars", "Dogs", "Luxury Hotels", "Budget Travel", "Thrift Shopping", "Sneakers", ...(form.backstory.interests || [])])].map(i => (
                  <Tag key={i} label={i} active={(form.backstory.interests || []).includes(i)} onClick={() => updateBackstory("interests", toggleArr(form.backstory.interests || [], i))} />
                ))}
                <AddTagButton onAdd={val => !(form.backstory.interests || []).includes(val) && updateBackstory("interests", [...(form.backstory.interests || []), val])} />
              </div>
            </FormSection>
          </>
        );

      // ── Step 8: Caption Style ───────────────────────────────────────────────
      case 8:
        return (
          <>
            <SectionTitle title="Caption & Content Style" sub="Define how this persona speaks on social media." />

            <FormSection title="Languages">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...new Set([...CAPTION_LANGUAGES, ...form.captionStyle.languages])].map(l => (
                  <Tag key={l} label={l} active={form.captionStyle.languages.includes(l)}
                    onClick={() => updateCaption("languages", toggleArr(form.captionStyle.languages, l))} />
                ))}
                <AddTagButton onAdd={val => !form.captionStyle.languages.includes(val) && updateCaption("languages", [...form.captionStyle.languages, val])} />
              </div>
            </FormSection>

            <FormSection title="Signature Phrases (add up to 5)">
              <input
                type="text"
                placeholder="e.g. Real talk: / Obsessed with…  (press Enter)"
                onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.trim() && form.captionStyle.phrases.length < 5) {
                    updateCaption("phrases", [...form.captionStyle.phrases, e.target.value.trim()]);
                    e.target.value = "";
                  }
                }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "11px 14px", fontSize: 13, outline: "none", width: "100%" }}
              />
              {form.captionStyle.phrases.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {form.captionStyle.phrases.map((p, i) => (
                    <span key={i} style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(57,255,20,0.1)", color: "#39ff14", fontSize: 12, cursor: "pointer" }}
                      onClick={() => updateCaption("phrases", form.captionStyle.phrases.filter((_, j) => j !== i))}>
                      {p} ✕
                    </span>
                  ))}
                </div>
              )}
            </FormSection>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: "1rem" }}>
              <Select label="Emoji Usage" value={form.captionStyle.emojiUsage} options={EMOJI_STYLES} onChange={v => updateCaption("emojiUsage", v)} />
              <Select label="CTA Style" value={form.captionStyle.ctaStyle} options={CTA_STYLES} onChange={v => updateCaption("ctaStyle", v)} />
              <Select label="Hashtag Strategy" value={form.captionStyle.hashtagStrategy} options={HASHTAG_STYLES} onChange={v => updateCaption("hashtagStrategy", v)} />
            </div>

            {/* Summary Card */}
            <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: 12, background: form.generationMethod === "ai" ? "rgba(57,255,20,0.04)" : "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{form.generationMethod === "ai" ? "⚡" : "📁"}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: form.generationMethod === "ai" ? "#39ff14" : "rgba(255,255,255,0.6)" }}>
                  {form.generationMethod === "ai" ? "Ready to Generate" : "Ready to Create"}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                {form.generationMethod === "ai"
                  ? `Our neural engine will now design a unique ${form.modelType} persona named "${form.name || "your model"}" — a ${form.ageRange} ${form.nationality} ${form.gender}. This takes 1-2 minutes.`
                  : `"${form.name || "Your model"}" will be created with full profile data. Upload reference photos from the dashboard after.`}
              </p>
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[form.gender, form.ageRange, form.nationality, form.modelType, ...form.niche.slice(0, 3)].filter(Boolean).map((tag, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </>
        );

      default: return null;
    }
  };

  const canProceed = () => {
    if (step === 2 && !form.name.trim()) return false;
    return true;
  };

  return (
    <div style={{ margin: "-2.5rem", minHeight: "100vh", background: "#0a0916", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        select option { background: #12101e !important; color: #fff !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(57,255,20,0.3); border-radius: 4px; }
        input:focus, select:focus, textarea:focus { border-color: #39ff14 !important; box-shadow: 0 0 0 1px rgba(57,255,20,0.15) !important; }
        .custom-tag-input:focus { border: none !important; box-shadow: none !important; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* Top Bar */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, background: "rgba(10,9,22,0.95)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <button onClick={() => navigate?.(`/dashboard/workspaces/${wsId}/ai-models`)}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>
          ←
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Generate AI Model</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>AI-powered persona creation</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "16px 24px 80px" }}>
        {/* Progress */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#39ff14" }}>
              {steps[step - 1]} — Step {step} of {TOTAL_STEPS}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #39ff14, #00ffcc)", width: `${(step / TOTAL_STEPS) * 100}%`, transition: "width 0.4s ease", borderRadius: 2 }} />
          </div>
          {/* Step indicators */}
          <div style={{ display: "flex", gap: 4, marginTop: 8, justifyContent: "space-between" }}>
            {steps.map((s, i) => (
              <button key={s} onClick={() => i < step && setStep(i + 1)}
                style={{
                  flex: 1, padding: "4px 2px", borderRadius: 6, border: "none",
                  background: i + 1 === step ? "rgba(57,255,20,0.15)" : i + 1 < step ? "rgba(57,255,20,0.06)" : "rgba(255,255,255,0.03)",
                  color: i + 1 === step ? "#39ff14" : i + 1 < step ? "rgba(57,255,20,0.6)" : "rgba(255,255,255,0.2)",
                  fontSize: 9, cursor: i + 1 <= step ? "pointer" : "default", fontWeight: 600, letterSpacing: "0.3px"
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1.5rem 2rem" }}>
          {renderStep()}

          {/* Navigation */}
          <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                visibility: step === 1 ? "hidden" : "visible",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", borderRadius: 10, padding: "11px 20px", cursor: "pointer", fontSize: 13
              }}>
              ← Previous
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => canProceed() && setStep(s => s + 1)}
                style={{
                  background: canProceed() ? "linear-gradient(135deg, #39ff14, #00ffcc)" : "rgba(255,255,255,0.1)",
                  border: "none", color: canProceed() ? "#000" : "rgba(255,255,255,0.3)",
                  borderRadius: 10, padding: "11px 24px", cursor: canProceed() ? "pointer" : "not-allowed",
                  fontSize: 13, fontWeight: 700
                }}>
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                style={{
                  background: isGenerating ? "rgba(255,255,255,0.1)" : (form.generationMethod === "ai" ? "linear-gradient(135deg, #39ff14, #00ffcc)" : "rgba(255,255,255,0.1)"),
                  border: form.generationMethod !== "ai" && !isGenerating ? "1px solid rgba(255,255,255,0.15)" : "none",
                  color: form.generationMethod === "ai" && !isGenerating ? "#000" : "#fff",
                  borderRadius: 10, padding: "12px 28px", cursor: isGenerating ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 800
                }}>
                {isGenerating 
                  ? (form.generationMethod === 'ai' ? 'Initializing...' : 'Creating...') 
                  : (form.generationMethod === "ai" ? "⚡ Generate AI Model" : "📁 Create Model")
                }
              </button>
            )}
          </div>
        </div>
      </div>


      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default WsAiModelGenerate;