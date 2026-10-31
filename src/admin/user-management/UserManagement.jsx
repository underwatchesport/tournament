import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";

export const UserManagement = () => {
  const { sanctions, issueSanction } = useAdmin();
  const [targetName, setTargetName] = useState("");
  const [type, setType] = useState("WARNING");
  const [reason, setReason] = useState("");

  const handleSanctionSubmit = (e) => {
    e.preventDefault();
    if (!targetName || !reason) return;
    issueSanction(targetName, type, reason);
    setTargetName("");
    setReason("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#FFD100]">PLAYER & TEAM SANCTION DESK</h2>
        <p className="text-xs text-[#8A99AD]">Manage toxic conduct warnings, season bans, and role access permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleSanctionSubmit} className="bg-[#141A24] border border-[#232D3F] p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase">Issue Sanction</h3>
          
          <div>
            <label className="block text-xs text-[#8A99AD] mb-1">Target BattleTag or Team Name</label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="ToxicPlayer#1234"
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#8A99AD] mb-1">Sanction Action</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-xs text-white"
            >
              <option value="WARNING">Official Warning</option>
              <option value="MATCH_FORFEIT">Match Forfeit</option>
              <option value="TEMP_BAN">Temporary Season Ban</option>
              <option value="PERM_BAN">Permanent Platform Blacklist</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#8A99AD] mb-1">Violation Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Offensive chat in lobby match..."
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded text-xs transition-all"
          >
            Apply Sanction Log
          </button>
        </form>

        <div className="md:col-span-2 bg-[#141A24] border border-[#232D3F] p-5 rounded-xl">
          <h3 className="text-sm font-bold text-white uppercase mb-4">Platform Sanction History</h3>
          <div className="space-y-3">
            {sanctions.map((s) => (
              <div key={s.id} className="p-3 bg-[#0B0E14] border border-[#232D3F] rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{s.targetName}</span>
                  <p className="text-[#8A99AD] text-[11px] mt-0.5">{s.reason}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded text-[10px]">
                    {s.type}
                  </span>
                  <div className="text-[10px] text-[#8A99AD] mt-1">{s.date} by {s.issuedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};