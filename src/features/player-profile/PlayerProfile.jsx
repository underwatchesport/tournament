import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getRankFromSR, validateBattleTag } from "../../utils/srValidators.js";

export const PlayerProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [battleTag, setBattleTag] = useState(user?.battleTag || "");
  const [discordTag, setDiscordTag] = useState(user?.discordTag || "");
  const [preferredRole, setPreferredRole] = useState(user?.preferredRole || "DPS");
  const [sr, setSr] = useState(user?.sr || 2850);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="p-8 text-center text-[#8A99AD]">
        Please sign in to view and edit your Underwatch Profile.
      </div>
    );
  }

  const currentRank = getRankFromSR(sr);

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateBattleTag(battleTag)) {
      setMessage("Error: Invalid BattleTag format (e.g. Name#1234).");
      return;
    }

    updateUserProfile({
      battleTag,
      discordTag,
      preferredRole,
      sr: parseInt(sr, 10)
    });

    setMessage("Profile successfully updated!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#141A24] border border-[#232D3F] rounded-xl shadow-xl">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#232D3F]">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-16 h-16 rounded-full border-2 border-[#00F0FF]"
        />
        <div>
          <h2 className="text-xl font-bold text-white">{user.username}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 text-xs font-semibold rounded">
              {currentRank.icon} {currentRank.name} ({sr} SR)
            </span>
            <span className="text-xs text-[#8A99AD]">{user.role.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 text-xs rounded-md ${
            message.startsWith("Error")
              ? "bg-red-500/10 border border-red-500/30 text-red-400"
              : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] mb-1">
              BattleTag (Compulsory for Tournaments)
            </label>
            <input
              type="text"
              value={battleTag}
              onChange={(e) => setBattleTag(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] mb-1">
              Discord Tag (Compulsory for Match Lobbies)
            </label>
            <input
              type="text"
              value={discordTag}
              onChange={(e) => setDiscordTag(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] mb-1">
              Primary Role
            </label>
            <select
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="Tank">Tank</option>
              <option value="DPS">Damage (DPS)</option>
              <option value="Support">Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] mb-1">
              Competitive SR Rank Rating
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              value={sr}
              onChange={(e) => setSr(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#00F0FF] text-black font-bold px-6 py-2.5 rounded-md text-sm hover:bg-[#00F0FF]/90 transition-all mt-4"
        >
          Save Profile Updates
        </button>
      </form>
    </div>
  );
};