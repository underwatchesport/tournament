import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export const BattleTagModal = () => {
  const { user, updateUserProfile } = useAuth();
  const [battleTag, setBattleTag] = useState(user?.battleTag || "");
  const [primaryRole, setPrimaryRole] = useState(user?.primaryRole || "dps");
  const [sr, setSr] = useState(user?.sr || 2500);

  if (!user || user.battleTag) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!battleTag.includes("#")) {
      alert("Please enter a valid BattleTag format (e.g. Gamer#1234)");
      return;
    }
    updateUserProfile({ battleTag, primaryRole, sr: parseInt(sr, 10) });
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
      <div className="bg-[#141A24] border border-[#00F0FF]/30 p-6 rounded-xl max-w-md w-full space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#FFD100]">COMPLETE PLAYER PROFILE</h3>
          <p className="text-xs text-[#8A99AD]">Enter your Overwatch 2 details to auto-fill tournament registrations and join squads.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#8A99AD] mb-1">BattleTag (Required)</label>
            <input
              type="text"
              value={battleTag}
              onChange={(e) => setBattleTag(e.target.value)}
              placeholder="PlayerName#1234"
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8A99AD] mb-1">Primary Role</label>
              <select
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="tank">Tank</option>
                <option value="dps">DPS</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#8A99AD] mb-1">Current SR</label>
              <input
                type="number"
                value={sr}
                onChange={(e) => setSr(e.target.value)}
                min="0"
                max="5000"
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00F0FF] text-black font-bold rounded text-sm hover:bg-[#00F0FF]/90 transition-all"
          >
            Save Player Info
          </button>
        </form>
      </div>
    </div>
  );
};