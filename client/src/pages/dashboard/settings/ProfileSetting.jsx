import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/authStore";

const ProfileSetting = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [location, setLocation] = useState(user?.profile?.location || "");
  const [website, setWebsite] = useState(user?.profile?.website || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.profile?.avatar || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("website", website);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    await updateProfile(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-8 w-full max-w-4xl"
    >
      <div>
        <h2 className="text-[28px] font-bold text-white mb-2">Personal Details</h2>
        <p className="text-[15px] text-muted leading-relaxed">Update your photo and personal details to personalize your AuraPost presence.</p>
      </div>

      <div className="flex items-center gap-8 p-8 rounded-2xl bg-[#0F0F0F] border border-[#1C1C1C] shadow-xl shadow-black/20">
        <div className="relative group">
          <img src={preview} alt="" className="w-28 h-28 rounded-full object-cover border-2 border-[#2A2A2A] shadow-lg" />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            <span className="text-[12px] text-white font-bold uppercase tracking-wider">Upload New</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-[20px] mb-1">{user?.name}</h3>
          <p className="text-muted text-[14px] mb-5">{user?.email}</p>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-[#39FF14] text-black text-[13px] font-bold rounded-xl hover:bg-[#32e012] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Upload New
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-2.5">
          <label className="text-[12px] font-semibold uppercase tracking-wider text-ghost/90 px-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all duration-200 shadow-inner"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="text-[12px] font-semibold uppercase tracking-wider text-ghost/90 px-1">Email Address</label>
          <input type="email" defaultValue={user?.email} className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-muted outline-none cursor-not-allowed opacity-60 font-medium" disabled />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[12px] font-semibold uppercase tracking-wider text-ghost/90 px-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all duration-200 shadow-inner"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="text-[12px] font-semibold uppercase tracking-wider text-ghost/90 px-1">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all duration-200 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-2.5 md:col-span-2">
          <label className="text-[12px] font-semibold uppercase tracking-wider text-ghost/90 px-1">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
            className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all duration-200 shadow-inner resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-[#1C1C1C] flex justify-end gap-5">
        <button
          onClick={() => {
            setName(user?.name || "");
            setBio(user?.profile?.bio || "");
            setLocation(user?.profile?.location || "");
            setWebsite(user?.profile?.website || "");
            setPreview(user?.profile?.avatar || "");
          }}
          className="px-6 py-3 text-muted hover:text-white transition-all font-semibold text-[15px]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isUpdatingProfile}
          className="btn-neon px-10 py-3 rounded-xl font-bold text-[15px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg shadow-[#39FF14]/10 hover:shadow-[#39FF14]/20"
        >
          {isUpdatingProfile ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes...
            </>
          ) : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileSetting;
