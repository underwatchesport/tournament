import React, { useState } from "react";
import { useTournaments } from "../../context/TournamentContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateTeamEligibility } from "../../utils/srValidators.js";

export const TournamentHub = () => {
  const { tournaments, registerTeamForTournament, updateTeamRoster } = useTournaments();
  const { user } = useAuth();

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [viewingTeamsTournament, setViewingTeamsTournament] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("create"); // 'create' | 'join'

  // Captain Creation Form
  const [teamName, setTeamName] = useState("");
  const [captainRole, setCaptainRole] = useState(user?.primaryRole || "tank");
  const [createdInviteCode, setCreatedInviteCode] = useState("");

  // Join Squad Form
  const [joinCode, setJoinCode] = useState("");
  const [selectedRoleSlot, setSelectedRoleSlot] = useState("dps");
  const [foundTeam, setFoundTeam] = useState(null);

  const [formErrors, setFormErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle Captain Team Creation
  const handleCreateTeam = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage("");

    if (!user) {
      setFormErrors(["You must be logged in with Discord to create a squad."]);
      return;
    }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const captainPlayer = {
      role: captainRole,
      battleTag: user.battleTag || `${user.username}#0000`,
      discordTag: user.discordTag || user.username,
      sr: user.sr || 2500,
      isCaptain: true,
      isSub: false,
    };

    const newTeam = {
      id: `tm_${Date.now()}`,
      name: teamName,
      inviteCode,
      captainBattleTag: captainPlayer.battleTag,
      captainDiscord: captainPlayer.discordTag,
      players: [captainPlayer],
      openSlots: [
        { role: "tank", isSub: false },
        { role: "dps", isSub: false },
        { role: "dps", isSub: false },
        { role: "support", isSub: false },
        { role: "support", isSub: false },
        { role: "sub", isSub: true },
        { role: "sub", isSub: true },
      ].filter((slot) => !(slot.role === captainRole && !slot.isSub)),
    };

    registerTeamForTournament(selectedTournament.id, newTeam);
    setCreatedInviteCode(inviteCode);
    setSuccessMessage(`Squad "${teamName}" created successfully! Share your invite code with teammates.`);
  };

  // Handle Teammate Joining via Code
  const handleSearchCode = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setFoundTeam(null);

    let targetTeam = null;
    for (const trn of tournaments) {
      const match = trn.registeredTeams?.find(
        (t) => t.inviteCode?.toUpperCase() === joinCode.trim().toUpperCase()
      );
      if (match) {
        targetTeam = { ...match, tournamentId: trn.id };
        break;
      }
    }

    if (!targetTeam) {
      setFormErrors(["Invalid invite code. Please check with your team captain."]);
      return;
    }

    setFoundTeam(targetTeam);
  };

  const handleJoinTeam = (e) => {
    e.preventDefault();
    if (!user) {
      setFormErrors(["You must be logged in to join a squad."]);
      return;
    }

    const newPlayer = {
      role: selectedRoleSlot,
      battleTag: user.battleTag || `${user.username}#0000`,
      discordTag: user.discordTag || user.username,
      sr: user.sr || 2500,
      isCaptain: false,
      isSub: selectedRoleSlot === "sub",
    };

    const updatedPlayers = [...(foundTeam.players || []), newPlayer];
    updateTeamRoster(foundTeam.tournamentId, foundTeam.id, updatedPlayers);

    setSuccessMessage(`You have joined "${foundTeam.name}" as ${selectedRoleSlot.toUpperCase()}!`);
    setFoundTeam(null);
    setJoinCode("");
  };

  return (
    <div className="space-y-6">
      {/* HUB HEADER */}
      <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#FFD100]">UNDERWATCH TOURNAMENT HUB</h2>
          <p className="text-xs text-[#8A99AD]">Browse active events, inspect rosters, form squads, or enter an invite code to join a team.</p>
        </div>
      </div>

      {/* TOURNAMENTS LIST */}
      <div className="grid grid-cols-1 gap-4">
        {tournaments.map((trn) => (
          <div key={trn.id} className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-semibold rounded border border-[#00F0FF]/30">
                  {trn.status}
                </span>
                <h3 className="text-lg font-bold text-white">{trn.title}</h3>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-[#8A99AD] mt-2">
                <span>Format: <strong className="text-white">{trn.format}</strong></span>
                <span>Max SR Cap: <strong className="text-[#FFD100]">{trn.maxSR} SR</strong></span>
                <span>Prize Pool: <strong className="text-emerald-400">{trn.prizePool}</strong></span>
                <span>Registered Teams: <strong className="text-white">{trn.registeredTeams?.length || 0} / {trn.maxTeams}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewingTeamsTournament(trn)}
                className="bg-[#0B0E14] border border-[#232D3F] hover:border-[#00F0FF] text-white font-semibold px-4 py-2 rounded text-sm transition-all"
              >
                View Teams ({trn.registeredTeams?.length || 0})
              </button>
              <button
                onClick={() => {
                  setSelectedTournament(trn);
                  setActiveModalTab("create");
                  setFormErrors([]);
                  setSuccessMessage("");
                  setCreatedInviteCode("");
                }}
                className="bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-bold px-4 py-2 rounded text-sm transition-all"
              >
                Create / Join Squad
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW TEAMS MODAL */}
      {viewingTeamsTournament && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#232D3F]">
              <div>
                <h3 className="text-lg font-bold text-[#FFD100]">Registered Teams & Roster Slots</h3>
                <p className="text-xs text-[#8A99AD]">{viewingTeamsTournament.title}</p>
              </div>
              <button onClick={() => setViewingTeamsTournament(null)} className="text-[#8A99AD] hover:text-white font-bold">✕</button>
            </div>

            {(!viewingTeamsTournament.registeredTeams || viewingTeamsTournament.registeredTeams.length === 0) ? (
              <p className="text-xs text-[#8A99AD] text-center py-6">No teams registered yet.</p>
            ) : (
              <div className="space-y-4">
                {viewingTeamsTournament.registeredTeams.map((team, idx) => (
                  <div key={team.id || idx} className="bg-[#0B0E14] border border-[#232D3F] p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-md">{team.name}</h4>
                        <span className="text-[10px] bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 px-2 py-0.5 rounded font-mono">
                          Invite Code: {team.inviteCode}
                        </span>
                      </div>
                      <span className="text-xs text-[#FFD100]">
                        {team.players?.length || 0}/7 Roster Slots
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {team.players?.map((p, pIdx) => (
                        <div key={pIdx} className={`p-2 rounded border flex items-center justify-between ${p.isSub ? "bg-[#1A202C] border-dashed border-purple-400/40" : "bg-[#141A24] border-[#232D3F]"}`}>
                          <div>
                            <span className={`text-[10px] font-bold uppercase mr-1.5 ${p.isSub ? "text-purple-400" : "text-[#00F0FF]"}`}>
                              [{p.isSub ? "SUB" : p.role}]
                            </span>
                            <span className="text-white font-medium">{p.battleTag}</span>
                            {p.isCaptain && <span className="text-[9px] text-[#FFD100] ml-1">(Captain)</span>}
                          </div>
                          <span className="text-[11px] text-[#8A99AD] font-mono">{p.sr} SR</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / JOIN SQUAD MODAL */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#FFD100]">Squad Management</h3>
              <button onClick={() => setSelectedTournament(null)} className="text-[#8A99AD] hover:text-white">✕</button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#232D3F]">
              <button
                onClick={() => { setActiveModalTab("create"); setFormErrors([]); setSuccessMessage(""); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 ${activeModalTab === "create" ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-[#8A99AD]"}`}
              >
                1. Create Squad (Captain)
              </button>
              <button
                onClick={() => { setActiveModalTab("join"); setFormErrors([]); setSuccessMessage(""); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 ${activeModalTab === "join" ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-[#8A99AD]"}`}
              >
                2. Join via Code
              </button>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded space-y-1">
                <div>{successMessage}</div>
              </div>
            )}

            {formErrors.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded space-y-1">
                {formErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}

            {/* TAB 1: CREATE SQUAD */}
            {activeModalTab === "create" && (
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">Squad / Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g., Sector 6 Strikers"
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">Captain Role Slot</label>
                  <select
                    value={captainRole}
                    onChange={(e) => setCaptainRole(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="tank">Tank</option>
                    <option value="dps">DPS</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div className="bg-[#0B0E14] p-3 rounded border border-[#232D3F] text-xs text-[#8A99AD]">
                  <p className="text-white font-semibold mb-1">Captain Auto-Filled Data:</p>
                  <p>BattleTag: <span className="text-[#00F0FF]">{user?.battleTag || "Not Set"}</span></p>
                  <p>Discord: <span className="text-[#00F0FF]">{user?.discordTag || user?.username}</span></p>
                  <p>SR: <span className="text-[#FFD100]">{user?.sr || 2500}</span></p>
                </div>

                {createdInviteCode && (
                  <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded text-center">
                    <span className="text-xs text-[#8A99AD] block">SHARE THIS CODE WITH TEAMMATES</span>
                    <span className="text-lg font-mono font-bold text-[#00F0FF] tracking-widest">{createdInviteCode}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00F0FF] text-black font-bold rounded text-sm hover:bg-[#00F0FF]/90 transition-all"
                >
                  Create Squad & Generate Invite Code
                </button>
              </form>
            )}

            {/* TAB 2: JOIN VIA INVITE CODE */}
            {activeModalTab === "join" && (
              <div className="space-y-4">
                <form onSubmit={handleSearchCode} className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#8A99AD] mb-1">Enter Team Invite Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="e.g., A1B2C3"
                        className="flex-1 bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white uppercase tracking-wider focus:outline-none focus:border-[#00F0FF]"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-[#232D3F] hover:bg-[#00F0FF] hover:text-black text-white px-4 py-2 rounded text-xs font-bold transition-all"
                      >
                        Find Squad
                      </button>
                    </div>
                  </div>
                </form>

                {foundTeam && (
                  <form onSubmit={handleJoinTeam} className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF]/30 space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{foundTeam.name}</h4>
                      <p className="text-xs text-[#8A99AD]">Captain: {foundTeam.captainBattleTag}</p>
                    </div>

                    <div>
                      <label className="block text-xs text-[#8A99AD] mb-1">Claim Roster Slot</label>
                      <select
                        value={selectedRoleSlot}
                        onChange={(e) => setSelectedRoleSlot(e.target.value)}
                        className="w-full bg-[#141A24] border border-[#232D3F] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                      >
                        <option value="tank">Tank Slot</option>
                        <option value="dps">DPS Slot</option>
                        <option value="support">Support Slot</option>
                        <option value="sub">Substitute (Sub) Slot</option>
                      </select>
                    </div>

                    <div className="text-xs text-[#8A99AD]">
                      Joining as: <span className="text-[#00F0FF]">{user?.battleTag || user?.username}</span> ({user?.sr || 2500} SR)
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#00F0FF] text-black font-bold rounded text-xs hover:bg-[#00F0FF]/90 transition-all"
                    >
                      Confirm & Join Squad Roster
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};