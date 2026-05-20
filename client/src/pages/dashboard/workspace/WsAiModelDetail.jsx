import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icons } from "../../../utils/dashboardData";
import { useAiModelStore } from "../../../store/aiModelStore";
import { useOutfitStore } from "../../../store/outfitStore";

const WsAiModelDetail = () => {
    const { wsId, modelId } = useParams();
    const navigate = useNavigate();
    const { fetchAiModelById, deleteAiModel, isLoading } = useAiModelStore();
    const { outfits, fetchOutfits, createOutfit, deleteOutfit, isLoading: isOutfitLoading } = useOutfitStore();
    const [model, setModel] = useState(null);
    const [activeTab, setActiveTab] = useState("home");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newOutfit, setNewOutfit] = useState({
        copyBackground: true,
        copyOutfit: true,
        copyPose: true,
        copyAccessories: true,
        sourceOutfitId: "",
        image: null,
        preview: null,
        modelPreview: null
    });

    const [hoveredOutfitId, setHoveredOutfitId] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const data = await fetchAiModelById(modelId);
                setModel(data);
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };
        if (modelId) loadModel();
    }, [modelId, fetchAiModelById]);
    useEffect(() => {
        let interval;
        if (activeTab === 'gallery' && modelId) {
            fetchOutfits(modelId);
            
            // Polling if any outfit is generating
            const checkGenerating = () => {
                if (useOutfitStore.getState().outfits.some(o => o.isGenerating)) {
                    fetchOutfits(modelId);
                }
            };
            interval = setInterval(checkGenerating, 5000);
        }
        return () => clearInterval(interval);
    }, [activeTab, modelId, fetchOutfits]);

    // Auto-delete failed outfits after 5 seconds
    useEffect(() => {
        const failedOutfits = outfits.filter(o => o.isFailed);
        failedOutfits.forEach(outfit => {
            setTimeout(() => {
                deleteOutfit(outfit._id);
            }, 5000);
        });
    }, [outfits, deleteOutfit]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewOutfit({
                ...newOutfit,
                image: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleRemix = (outfit) => {
        setNewOutfit({
            copyBackground: true,
            copyOutfit: true,
            copyPose: true,
            copyAccessories: true,
            sourceOutfitId: outfit._id,
            image: null,
            preview: null,
            modelPreview: outfit.photoUrl
        });
        setShowAddModal(true);
    };

    const handleCreateOutfit = async () => {
        if (!newOutfit.image || !newOutfit.sourceOutfitId) {
            alert("Please ensure both a model image (from remix) and a reference image are selected.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("workspaceId", wsId);
            formData.append("influencerId", modelId);
            formData.append("copyBackground", newOutfit.copyBackground);
            formData.append("copyOutfit", newOutfit.copyOutfit);
            formData.append("copyPose", newOutfit.copyPose);
            formData.append("copyAccessories", newOutfit.copyAccessories);
            if (newOutfit.sourceOutfitId) formData.append("sourceOutfitId", newOutfit.sourceOutfitId);
            if (newOutfit.image) formData.append("image", newOutfit.image);

            await createOutfit(formData);
            setShowAddModal(false);
            setNewOutfit({
                copyBackground: true,
                copyOutfit: true,
                copyPose: true,
                copyAccessories: true,
                sourceOutfitId: "",
                image: null,
                preview: null,
                modelPreview: null
            });
        } catch (error) {
            console.error("Failed to create outfit:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !model) {
        return (
            <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
                <div className="loader" />
            </div>
        );
    }

    const tabs = [
        { id: "home", label: "Home", icon: Icons.home },
        { id: "gallery", label: "Gallery", icon: Icons.layers },
        { id: "personality", label: "Personality", icon: Icons.zap },
        { id: "voice", label: "Voice & Language", icon: Icons.bell },
        { id: "performance", label: "Performance", icon: Icons.chart },
        { id: "settings", label: "Settings", icon: Icons.settings }
    ];

    const renderSection = () => {
        switch (activeTab) {
            case "home":
                return (
                    <div className="animate-fade-in-up">
                        {/* Core Identity & Photo Section */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "2rem" }}>
                            {/* Profile Photo */}
                            <div className="card" style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                                    <div style={{ color: "var(--color-violet)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={Icons.users} /></svg></div>
                                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Profile Photo</span>
                                </div>
                                <div style={{ width: "100%", aspectRatio: "1", borderRadius: "12px", overflow: "hidden", border: "1px dashed rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)" }}>
                                    {model.profilePhotoUrl ? (
                                        <img src={model.profilePhotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2"><path d={Icons.upload} /></svg>
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                    <div style={{ fontSize: "11px", color: "var(--color-dim)" }}>Primary face reference</div>
                                </div>
                            </div>

                            {/* Basic Info & Traits */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div className="card" style={{ padding: "1.5rem" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.2rem", color: "var(--color-neon)" }}>Basic Info</h3>
                                    <div style={{ display: "grid", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "10px", color: "var(--color-dim)", textTransform: "uppercase", marginBottom: "4px" }}>Name</label>
                                            <div style={{ fontSize: "13px", fontWeight: 500 }}>{model.name}</div>
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "10px", color: "var(--color-dim)", textTransform: "uppercase", marginBottom: "4px" }}>Region</label>
                                            <div style={{ fontSize: "13px", fontWeight: 500 }}>{model.nationality}</div>
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "10px", color: "var(--color-dim)", textTransform: "uppercase", marginBottom: "4px" }}>Age & Gender</label>
                                            <div style={{ fontSize: "13px", fontWeight: 500 }}>{model.ageRange} • {model.gender}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card" style={{ padding: "1.5rem" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.2rem", color: "var(--color-blue)" }}>Physical Traits</h3>
                                    <div style={{ display: "grid", gap: "8px" }}>
                                        {Object.entries(model.traits).map(([key, value]) => {
                                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                                            return (
                                                <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                                    <span style={{ fontSize: "11px", color: "var(--color-muted)", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span style={{ fontSize: "11px", fontWeight: 600 }}>
                                                        {Array.isArray(value) ? value.join(", ") : value}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "personality":
                return (
                    <div className="animate-fade-in-up">
                        <div className="section-title-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-dim)" }}>Personality & Backstory</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div className="card" style={{ padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "var(--color-orange)" }}>☺</span> Emotional backstory
                                </h3>
                                <p style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                                    {model.backstory?.originStory || "No backstory defined yet."}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {['Authenticity', 'Sustainability', 'Self-love'].map(tag => (
                                        <span key={tag} className="tag" style={{ background: "rgba(143,136,232,0.1)", color: "var(--color-violet)", padding: "4px 12px", borderRadius: "20px", fontSize: "11px" }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="card" style={{ padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "var(--color-orange)" }}>⛓</span> Personality traits
                                </h3>
                                <div style={{ display: "grid", gap: "20px" }}>
                                    {Object.entries(model.sliders).map(([key, value]) => (
                                        <div key={key}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                                <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "capitalize" }}>{key}</span>
                                                <span style={{ fontSize: "11px", color: "var(--color-dim)" }}>{value}%</span>
                                            </div>
                                            <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                                                <div style={{ height: "100%", width: `${value}%`, background: "var(--color-violet)", borderRadius: "2px" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "gallery":
                return (
                    <div className="animate-fade-in-up">
                        <div className="section-title-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>
                            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-dim)" }}>Style & Wardrobe</span>
                        </div>
                        <div className="card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "var(--color-pink)" }}>👚</span> Dress style & wardrobe gallery
                                </h3>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "1.5rem" }}>Upload outfits — AI uses these to generate consistent clothing for new posts.</p>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                                {outfits.map((outfit) => (
                                    <div 
                                        key={outfit._id} 
                                        style={{ position: "relative" }}
                                        onMouseEnter={() => setHoveredOutfitId(outfit._id)}
                                        onMouseLeave={() => setHoveredOutfitId(null)}
                                    >
                                        <div style={{ aspectRatio: "0.8", borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                                            {outfit.isGenerating ? (
                                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", animation: "pulse 2s infinite" }}>
                                                    <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--color-pink)", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "10px" }} />
                                                    <span style={{ fontSize: "12px", color: "var(--color-dim)" }}>Generating...</span>
                                                </div>
                                            ) : outfit.isFailed ? (
                                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,0,0,0.1)" }}>
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" style={{ marginBottom: "10px" }}><path d="M18 6L6 18M6 6l12 12"/></svg>
                                                    <span style={{ fontSize: "12px", color: "red", fontWeight: 600 }}>Failed!</span>
                                                    <span style={{ fontSize: "10px", color: "rgba(255,0,0,0.7)" }}>Deleting...</span>
                                                </div>
                                            ) : (
                                                <img src={outfit.photoUrl} alt="Outfit" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            )}
                                            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "15px 10px", opacity: "0.9" }}>
                                                <div style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Reference Outfit</div>
                                                <div style={{ fontSize: "10px", color: "var(--color-dim)", marginTop: "2px" }}>{new Date(outfit.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            {outfit.canBeRemoved !== false && (
                                                <div style={{
                                                    position: "absolute", top: "10px", left: "10px",
                                                    opacity: hoveredOutfitId === outfit._id ? 1 : 0,
                                                    transform: hoveredOutfitId === outfit._id ? "translateY(0)" : "translateY(-10px)",
                                                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                                    zIndex: 15
                                                }}>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); deleteOutfit(outfit._id); }}
                                                        style={{ 
                                                            background: "rgba(255,50,50,0.15)", 
                                                            backdropFilter: "blur(8px)",
                                                            border: "1px solid rgba(255,50,50,0.3)", 
                                                            width: "32px", height: "32px",
                                                            borderRadius: "50%", 
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            cursor: "pointer", 
                                                            color: "#ff4d4d", 
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                                            transition: "all 0.2s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,50,50,0.4)";
                                                            e.currentTarget.style.transform = "scale(1.1)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,50,50,0.15)";
                                                            e.currentTarget.style.transform = "scale(1)";
                                                        }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={Icons.trash} /></svg>
                                                    </button>
                                                </div>
                                            )}
                                            {/* Remix Button overlay */}
                                            <div className="remix-overlay" style={{
                                                position: "absolute", top: "0", right: "0",
                                                transform: hoveredOutfitId === outfit._id ? "translate(0, 0)" : "translate(100%, -100%)",
                                                transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                                zIndex: 10
                                            }}>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleRemix(outfit); }}
                                                    style={{ 
                                                        background: "#ffffff", 
                                                        border: "none", 
                                                        padding: "6px 15px 6px 24px", 
                                                        cursor: "pointer", 
                                                        color: "#000", 
                                                        fontSize: "12px", 
                                                        fontWeight: 700, 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        gap: "6px",
                                                        clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0 100%)",
                                                        boxShadow: "-2px 2px 10px rgba(0,0,0,0.2)"
                                                    }}
                                                >
                                                    Remix
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "voice":
                return (
                    <div className="animate-fade-in-up">
                        <div className="section-title-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v1a7 7 0 01-14 0v-1 M12 19v4 M8 23h8" /></svg>
                            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-dim)" }}>Voice & Language</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div className="card" style={{ padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "var(--color-violet)" }}>🔊</span> AI voice
                                </h3>
                                <p style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "1.5rem" }}>Voice used for Reels voiceovers — generated via ElevenLabs</p>

                                <div style={{ display: "grid", gap: "10px" }}>
                                    {[
                                        { name: 'Aria — Warm & confident', sub: 'Young female • Hindi-English accent', selected: true },
                                        { name: 'Nova — Energetic & bold', sub: 'Young female • Neutral accent', selected: false }
                                    ].map((v, i) => (
                                        <div key={i} style={{ padding: "12px 16px", borderRadius: "10px", background: v.selected ? "rgba(143,136,232,0.05)" : "rgba(255,255,255,0.02)", border: v.selected ? "1px solid var(--color-violet)" : "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "15px" }}>
                                            <button style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(143,136,232,0.15)", border: "none", color: "var(--color-violet)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                            </button>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "13px", fontWeight: 600 }}>{v.name}</div>
                                                <div style={{ fontSize: "11px", color: "var(--color-dim)" }}>{v.sub}</div>
                                            </div>
                                            {v.selected && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-violet)" strokeWidth="3"><path d={Icons.check} /></svg>}
                                        </div>
                                    ))}
                                    <button className="btn-ghost" style={{ width: "100%", padding: "12px", fontSize: "13px", marginTop: "10px" }}>+ Clone custom voice</button>
                                </div>
                            </div>

                            <div className="card" style={{ padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "var(--color-violet)" }}>💬</span> Caption style
                                </h3>
                                <p style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "1.5rem" }}>How the AI writes captions, replies, and story text</p>

                                <div style={{ display: "grid", gap: "20px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "11px", color: "var(--color-muted)", marginBottom: "8px" }}>Languages</label>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {['English', 'Hindi', 'Hinglish'].map(l => (
                                                <span key={l} className="tag" style={{ background: "rgba(143,136,232,0.1)", color: "var(--color-violet)", padding: "4px 12px", borderRadius: "20px", fontSize: "11px" }}>{l}</span>
                                            ))}
                                            <button className="tag" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-dim)", padding: "4px 12px", borderRadius: "20px", fontSize: "11px" }}>+ Add</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "11px", color: "var(--color-muted)", marginBottom: "8px" }}>Signature phrases</label>
                                        <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", color: "var(--color-dim)", fontSize: "13px" }}>
                                            e.g. 'Live your story', 'Real talk:', 'Not gonna lie...'
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "11px", color: "var(--color-muted)", marginBottom: "8px" }}>Emoji usage</label>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            {['None', 'Moderate', 'Heavy'].map(opt => (
                                                <span key={opt} style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "6px", background: opt === 'Moderate' ? "rgba(143,136,232,0.15)" : "rgba(255,255,255,0.02)", color: opt === 'Moderate' ? "var(--color-violet)" : "var(--color-dim)", fontWeight: opt === 'Moderate' ? 600 : 400 }}>{opt}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "performance":
                return (
                    <div className="animate-fade-in-up">
                        <div className="section-title-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2"><path d={Icons.chart} /></svg>
                            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-dim)" }}>Performance Metrics</span>
                        </div>
                        <div className="card" style={{ padding: "3rem", textAlign: "center", background: "rgba(255,255,255,0.01)" }}>
                            <div style={{ fontSize: "48px", marginBottom: "20px" }}>📊</div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>Analytics are being gathered</h3>
                            <p style={{ color: "var(--color-muted)", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
                                Once you start generating and posting content with {model.name}, detailed performance metrics will appear here.
                            </p>
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div className="animate-fade-in-up">
                        <div className="section-title-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2"><path d={Icons.settings} /></svg>
                            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-dim)" }}>Model Settings</span>
                        </div>
                        <div className="card" style={{ padding: "2rem", border: "1px solid rgba(255,50,50,0.1)", background: "rgba(255,50,50,0.02)" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#ff4d4d", marginBottom: "0.5rem" }}>Danger Zone</h3>
                            <p style={{ fontSize: "13px", color: "var(--color-muted)", marginBottom: "1.5rem" }}>Permanently remove this AI Model and all associated data. This action cannot be undone.</p>
                            
                            <button 
                                className="btn-ghost"
                                style={{ 
                                    background: "rgba(255,50,50,0.1)", 
                                    color: "#ff4d4d", 
                                    border: "1px solid rgba(255,50,50,0.2)",
                                    padding: "10px 20px",
                                    fontWeight: 600,
                                    borderRadius: "10px"
                                }}
                                onClick={async () => {
                                    if (window.confirm("Are you sure you want to delete this AI Model? This action is permanent.")) {
                                        await deleteAiModel(modelId);
                                        navigate(`/dashboard/workspaces/${wsId}/ai-models`);
                                    }
                                }}
                            >
                                Delete AI Model
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div className="text-dim p-8">Section {activeTab} content coming soon...</div>;
        }
    };

    return (
        <>
            <div className="fade-in">
            {/* Top Header with Back Button */}
            <div className="topbar" style={{ marginBottom: "0", borderBottom: "none", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                        className="btn-ghost"
                        style={{ padding: "8px", borderRadius: "50%" }}
                        onClick={() => navigate(`/dashboard/workspaces/${wsId}/ai-models`)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="topbar-title" style={{ fontSize: "16px" }}>Manage AI Model</h1>
                </div>
            </div>

            {/* Profile Header (Horizontal - Compact) */}
            <div className="card" style={{ padding: "0", marginBottom: "1.2rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px" }}>
                {/* Banner Area */}
                <div style={{
                    height: "50px", // Reduced from 70px
                    background: "linear-gradient(90deg, rgba(57,255,20,0.1) 0%, rgba(143,136,232,0.1) 100%)",
                    position: "relative",
                    pointerEvents: "none"
                }} />

                <div style={{
                    padding: "0 1.2rem 0.8rem", // Reduced padding
                    marginTop: "-30px", // Reduced from -45px
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    position: "relative",
                    zIndex: 10
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{
                            width: "90px", // Reduced from 90px
                            height: "90px",
                            borderRadius: "50%",
                            background: "#12101e",
                            border: "3px solid #12101e",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {model.profilePhotoUrl ? (
                                <img src={model.profilePhotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span style={{ fontSize: "28px" }}>👤</span>
                            )}
                        </div>
                        <div style={{ marginBottom: "2px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{model.name}</h2>
                                <span style={{ fontSize: "8px", padding: "2px 5px", background: "rgba(57,255,20,0.1)", color: "var(--color-neon)", borderRadius: "20px", fontWeight: 700, border: "1px solid rgba(57,255,20,0.2)" }}>ACTIVE</span>
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "1px" }}>
                                {model.niche?.join(" • ")} • {model.nationality}
                            </div>
                        </div>
                    </div>

                    {/* Nav Tabs with Premium Background */}
                    <div style={{
                        display: "flex",
                        gap: "4px",
                        background: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                        padding: "4px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        marginBottom: "4px"
                    }}>
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id;
                            const colors = {
                                home: "var(--color-blue)",
                                gallery: "var(--color-pink)",
                                info: "var(--color-orange)",
                                personality: "var(--color-violet)",
                                voice: "var(--color-yellow)",
                                performance: "var(--color-neon)",
                                settings: "var(--color-dim)"
                            };
                            const tabColor = colors[tab.id] || "var(--color-neon)";

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 18px",
                                        borderRadius: "10px",
                                        border: "none",
                                        background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                                        color: isActive ? tabColor : "rgba(255,255,255,0.5)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontSize: "13px",
                                        fontWeight: isActive ? 700 : 500
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={tab.icon} />
                                    </svg>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {renderSection()}
            </div>

            </div>

            {/* Add Outfit Modal - Placed at root to avoid stacking context issues with animations */}
            {showAddModal && (
                <div style={{ 
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
                    background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(12px)", 
                    zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center"
                }} onClick={() => setShowAddModal(false)}>
                    <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ 
                        position: "relative",
                        margin: "auto",
                        padding: 0, 
                        overflow: "hidden", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 0 100px rgba(0,0,0,0.5)"
                    }}>
                        {/* Modal Header */}
                        <div style={{ 
                            padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "rgba(255,255,255,0.01)"
                        }}>
                            <div>
                                <h2 className="modal-title" style={{ textAlign: "left", marginBottom: "4px" }}>Add New Outfit</h2>
                                <p className="modal-sub" style={{ textAlign: "left", marginBottom: 0 }}>Upload a reference photo to expand your model's wardrobe.</p>
                            </div>
                            <button 
                                className="modal-close" 
                                onClick={() => setShowAddModal(false)}
                                style={{ position: "static" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="modal-grid" style={{ gap: 0 }}>
                            {/* Left Side: Image Preview & Upload */}
                            <div style={{ 
                                padding: "2rem", background: "rgba(0,0,0,0.15)", 
                                borderRight: "1px solid rgba(255,255,255,0.05)",
                                display: "flex", flexDirection: "column"
                            }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", flex: 1, minHeight: "380px" }}>
                                    {/* Model Image Preview */}
                                    <div style={{ 
                                        borderRadius: "16px", background: "rgba(255,255,255,0.02)", 
                                        border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", position: "relative"
                                    }}>
                                        {newOutfit.modelPreview && (
                                            <>
                                                <img src={newOutfit.modelPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Model Image" />
                                                <div style={{ 
                                                    position: "absolute", top: "10px", left: "10px", 
                                                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                                                    padding: "4px 8px", borderRadius: "4px", fontSize: "10px", color: "#fff", fontWeight: 600
                                                }}>
                                                    Model Face
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Reference Image Upload */}
                                    <div 
                                        onClick={() => document.getElementById('outfit-upload').click()}
                                        style={{ 
                                            borderRadius: "16px", border: "2px dashed rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", 
                                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                                            cursor: "pointer", overflow: "hidden", position: "relative", transition: "all 0.3s ease"
                                        }}
                                    >
                                        {newOutfit.preview ? (
                                            <>
                                                <img src={newOutfit.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                <div style={{ 
                                                    position: "absolute", top: "10px", left: "10px", 
                                                    background: "rgba(57,255,20,0.2)", backdropFilter: "blur(4px)",
                                                    padding: "4px 8px", borderRadius: "4px", fontSize: "10px", color: "var(--color-neon)", fontWeight: 600, border: "1px solid rgba(57,255,20,0.2)"
                                                }}>
                                                    Reference Style
                                                </div>
                                                <div style={{ 
                                                    position: "absolute", bottom: "15px", left: "15px", right: "15px",
                                                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
                                                    padding: "8px", borderRadius: "8px", fontSize: "11px", color: "#fff",
                                                    textAlign: "center", border: "1px solid rgba(255,255,255,0.1)"
                                                }}>
                                                    Change Image
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "1rem" }}>
                                                <div style={{ 
                                                    width: "48px", height: "48px", borderRadius: "50%", background: "rgba(57,255,20,0.1)",
                                                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
                                                    color: "var(--color-neon)"
                                                }}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={Icons.upload} /></svg>
                                                </div>
                                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff", display: "block" }}>Upload Reference</span>
                                                <span style={{ fontSize: "10px", color: "var(--color-dim)", marginTop: "6px", display: "block" }}>For Pose, Outfit & BG</span>
                                            </div>
                                        )}
                                        <input id="outfit-upload" type="file" hidden onChange={handleFileChange} accept="image/*" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Form Fields */}
                            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* AI Options */}
                                <div style={{ 
                                    background: "rgba(57,255,20,0.02)", padding: "1.5rem", borderRadius: "16px", 
                                    border: "1px solid rgba(57,255,20,0.1)", marginTop: "5px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                                        <div style={{ color: "var(--color-neon)", fontSize: "16px" }}>⚡</div>
                                        <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>Remix AI Settings</span>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "13px", color: "#c8c4e0" }}>Copy Pose & Camera Angle</span>
                                            <input 
                                                type="checkbox" 
                                                checked={newOutfit.copyPose} 
                                                onChange={(e) => setNewOutfit({...newOutfit, copyPose: e.target.checked})} 
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "13px", color: "#c8c4e0" }}>Copy Background Context</span>
                                            <input 
                                                type="checkbox" 
                                                checked={newOutfit.copyBackground} 
                                                onChange={(e) => setNewOutfit({...newOutfit, copyBackground: e.target.checked})} 
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "13px", color: "#c8c4e0" }}>Sync Outfit Elements</span>
                                            <input 
                                                type="checkbox" 
                                                checked={newOutfit.copyOutfit} 
                                                onChange={(e) => setNewOutfit({...newOutfit, copyOutfit: e.target.checked})} 
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "13px", color: "#c8c4e0" }}>Copy Accessories</span>
                                            <input 
                                                type="checkbox" 
                                                checked={newOutfit.copyAccessories} 
                                                onChange={(e) => setNewOutfit({...newOutfit, copyAccessories: e.target.checked})} 
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className="btn-accent" 
                                    style={{ 
                                        width: "100%", padding: "16px", borderRadius: "12px", 
                                        fontSize: "15px", fontWeight: 700, marginTop: "auto",
                                        justifyContent: "center"
                                    }}
                                    disabled={isSubmitting}
                                    onClick={handleCreateOutfit}
                                >
                                    {isSubmitting ? "Generating AI Request..." : "Start Generation"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WsAiModelDetail;
