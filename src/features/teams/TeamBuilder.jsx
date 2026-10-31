import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateBattleTag, calculateTeamAverageSR } from "../../utils/srValidators.js";

export const TeamBuilder = () => {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([
    { name: user?.username || "Captain", role: "Tank", battleTag: user?.battleTag || "", discordTag: user?.discordTag || "", sr: 3000 },
    { name: "DPS 1", role: "DPS", battleTag: "", discordTag: "", sr: 2900 },
    { name: "DPS 2", role: "DPS", battleTag: "", discordTag: "", sr: 2850 },
    { name: "Support 1", role: "Support", battleTag: "", discordTag: "", sr: 2950 },
    { name: "Support 2", role: "Support", battleTag: "", discordTag: "", sr: 2900 }
  ]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const updatePlayer = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const handleSaveTeam = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!teamName.trim()) {
      setErrorMsg("Team name is required.");
      return;
    }

    for (let p of players) {
      if (!validateBattleTag(p.battleTag)) {
        setErrorMsg(`Invalid BattleTag format for ${p.name}. Required format: Player#1234`);
        return;
      }
      if (!p.discordTag.trim()) {
        setErrorMsg(`Discord tag required for ${p.name}.`);
        return;
      }
    }

    setSuccessMsg(`Team "${teamName}" successfully registered with an average SR of ${calculateTeamAverageSR(players)}!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl">
        <h2 className="text-xl font-bold text-[#FFD100] mb-1">TEAM & ROSTER BUILDER</h2>
        <p className="text-xs text-[#8A99AD]">Configure your 5v5 Overwatch roster with compulsory BattleTags and Discord tags.</p>
      </div>

      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded">{successMsg}</div>}
      {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">{errorMsg}</div>}

      <form onSubmit={handleSaveTeam} className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-[#8A99AD] mb-1">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Cyber Foxes"
            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Required 5v5 Roster Slots</h3>
          {players.map((p, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-[#0B0E14] border border-[#232D3F] rounded-lg items-center">
              <div>
                <span className="text-[10px] text-[#00F0FF] uppercase font-bold">{p.role}</span>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePlayer(index, "name", e.target.value)}
                  placeholder="Player Name"
                  className="w-full bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-xs text-white mt-1"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <span className="text-[10px] text-[#8A99AD]">Overwatch BattleTag</span>
                <input
                  type="text"
                  value={p.battleTag}
                  onChange={(e) => updatePlayer(index, "battleTag", e.target.value)}
                  placeholder="Name#1234"
                  className="w-full bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-xs text-white mt-1"
                  required
                />
              </div>
              <div>
                <span className="text-[10px] text-[#8A99AD]">Discord Tag</span>
                <input
                  type="text"
                  value={p.discordTag}
                  onChange={(e) => updatePlayer(index, "discordTag", e.target.value)}
                  placeholder="name#0001"
                  className="w-full bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-xs text-white mt-1"
                  required
                />
              </div>
              <div>
                <span className="text-[10px] text-[#8A99AD]">SR</span>
                <input
                  type="number"
                  value={p.sr}
                  onChange={(e) => updatePlayer(index, "sr", e.target.value)}
                  className="w-full bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-xs text-white mt-1"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#00F0FF] text-black font-bold px-6 py-2.5 rounded text-sm hover:bg-[#00F0FF]/90 transition-all"
        >
          Save & Register Roster
        </button>
      </form>
    </div>
  );
};