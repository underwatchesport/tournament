import React, { useState, useEffect } from "react";
import { useTournaments } from "../../context/TournamentContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export const TournamentHub = () => {
  const { tournaments, registerTeamForTournament, updateTeamRoster } = useTournaments();
  const { user } = useAuth();
  
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [viewingTeamsTournament, setViewingTeamsTournament] = useState(null);
  const [modalTab, setModalTab] = useState("create"); // "create" or "join"

  // Create Team States
  const [teamName, setTeamName] = useState("");
  const [captainRole, setCaptainRole] = useState(user?.primaryRole || "tank");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");

  // Join Team States
  const [inputInviteCode, setInputInviteCode] = useState("");
  const [foundTeam, setFoundTeam] = useState(null);
  const [joinRole, setJoinRole] = useState("dps");
  const [isSubSlot, setIsSubSlot] = useState(false);

  // Auto-fill captain role if user changes
  useEffect(() => {
    if (user?.primaryRole) {
      setCaptainRole(user.primaryRole);
    }
  }, [user]);

  // Handle Captain Creating Squad (Bypasses full 5-player requirement so teammates can join via code)
  const handleCreateTeam = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage("");

    if (!user || !user.battleTag) {
      setFormErrors(["You must be logged in and have a BattleTag set to create a team."]);
      return;
    }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const captainPlayer = {
      role: captainRole,
      battleTag: user.battleTag,
      discordTag: user.discordTag || user.username || "Captain",
      sr: user.sr || 2500,
      isCaptain: true,
      isSub: false
    };

    const teamPayload = {
      id: `tm_${Date.now()}`,
      name: teamName,
      inviteCode,
      captainBattleTag: user.battleTag,
      captainDiscord: user.discordTag || user.username,
      players: [captainPlayer]
    };

    // Check SR cap only against captain if set on tournament
    if (selectedTournament.maxSR && captainPlayer.sr > selectedTournament.maxSR) {
      setFormErrors([`Your SR (${captainPlayer.sr}) exceeds the tournament maximum SR cap of ${selectedTournament.maxSR}.`]);
      return;
    }

    registerTeamForTournament(selectedTournament.id, teamPayload);
    setGeneratedInviteCode(inviteCode);
    setSuccessMessage(`Team "${teamName}" created successfully! Share your invite code with teammates.`);
  };

  // Handle Finding Team by Invite Code
  const handleFindTeamByCode = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setFoundTeam(null);

    let matchedTeam = null;
    let matchedTrnId = null;

    for (const trn of tournaments) {
      const found = trn.registeredTeams?.find(
        (t) => t.inviteCode?.toUpperCase() === inputInviteCode.trim().toUpperCase()
      );
      if (found) {
        matchedTeam = found;
        matchedTrnId = trn.id;
        break;
      }
    }

    if (!matchedTeam) {
      setFormErrors(["Invalid invite code. Please check with your team captain."]);
      return;
    }

    if ((matchedTeam.players?.length || 0) >= 7) {
      setFormErrors(["This team's roster and substitute slots are completely full (max 7 players)."]);
      return;
    }

    setFoundTeam({ ...matchedTeam, tournamentId: matchedTrnId });
  };

  // Handle Teammate / Sub Joining Team
  const handleJoinTeam = (e) => {
    e.preventDefault();
    if (!user || !user.battleTag) {
      setFormErrors(["You must be logged in and have your BattleTag set to join a squad."]);
      return;
    }

    const newPlayer = {
      role: isSubSlot ? "sub" : joinRole,
      battleTag: user.battleTag,
      discordTag: user.discordTag || user.username || "Player",
      sr: user.sr || 2500,
      isCaptain: false,
      isSub: isSubSlot
    };

    const updatedPlayers = [...(foundTeam.players || []), newPlayer];
    updateTeamRoster(foundTeam.tournamentId, foundTeam.id, updatedPlayers);

    setSuccessMessage(`Successfully joined "${foundTeam.name}" as ${isSubSlot ? "Substitute" : joinRole.toUpperCase()}!`);
    setFoundTeam(null);
    setInputInviteCode("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#FFD100]">UNDERWATCH TOURNAMENT HUB</h2>
          <p className="text-xs text-[#8A99AD]">Browse active tournaments, view registered rosters, create squads, and assign substitutes.</p>
        </div>
      </div>

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
                  setModalTab("create");
                  setFormErrors([]);
                  setSuccessMessage("");
                  setGeneratedInviteCode("");
                  setFoundTeam(null);
                  setInputInviteCode("");
                }}
                className="bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-bold px-4 py-2 rounded text-sm transition-all"
              >
                Create / Join Squad
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PUBLIC TEAMS & SUBS MODAL */}
      {viewingTeamsTournament && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#232D3F]">
              <div>
                <h3 className="text-lg font-bold text-[#FFD100]">Registered Teams & Substitutes</h3>
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
                        {team.inviteCode && (
                          <span className="text-[10px] bg-[#232D3F] text-[#00F0FF] px-2 py-0.5 rounded border border-[#00F0FF]/30 font-mono">
                            Code: {team.inviteCode}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-mono">
                        Slots: {team.players?.length || 0} / 7
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {team.players?.map((p, pIdx) => (
                        <div key={pIdx} className={`p-2 rounded border flex items-center justify-between ${p.isSub ? "bg-[#1A202C] border-dashed border-purple-400/40" : "bg-[#141A24] border-[#232D3F]"}`}>
                          <div>
                            <span className={`text-[10px] font-bold uppercase mr-1.5 ${p.isSub ? "text-purple-400" : "text-[#FFD100]"}`}>
                              [{p.isSub ? "SUB" : p.role}]
                            </span>
                            <span className="text-white font-medium">{p.battleTag}</span>
                            {p.isCaptain && <span className="text-[9px] text-[#00F0FF] ml-1">(Captain)</span>}
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

      {/* SQUAD REGISTRATION MODAL */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#FFD100]">Squad Registration: {selectedTournament.title}</h3>
              <button onClick={() => setSelectedTournament(null)} className="text-[#8A99AD] hover:text-white">✕</button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#232D3F]">
              <button
                type="button"
                onClick={() => { setModalTab("create"); setFormErrors([]); setSuccessMessage(""); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 ${modalTab === "create" ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-[#8A99AD]"}`}
              >
                Create Squad (Captain)
              </button>
              <button
                type="button"
                onClick={() => { setModalTab("join"); setFormErrors([]); setSuccessMessage(""); }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 ${modalTab === "join" ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-[#8A99AD]"}`}
              >
                Join via Invite Code
              </button>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded">
                {successMessage}
              </div>
            )}

            {formErrors.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded space-y-1">
                {formErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}

            {/* TAB 1: CREATE SQUAD */}
            {modalTab === "create" && (
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">Team Name</label>
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
                  <label className="block text-xs text-[#8A99AD] mb-1">Your Captain Role</label>
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

                <div className="bg-[#0B0E14] p-3 rounded border border-[#232D3F] text-xs space-y-1 text-[#8A99AD]">
                  <p className="text-white font-semibold">Captain Profile (Auto-Filled):</p>
                  <p>BattleTag: <span className="text-[#00F0FF]">{user?.battleTag || "Not Set (Please set via profile)"}</span></p>
                  <p>SR: <span className="text-[#FFD100]">{user?.sr || 2500}</span></p>
                </div>

                {generatedInviteCode && (
                  <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded text-center space-y-1">
                    <span className="text-[10px] text-[#8A99AD] block">YOUR TEAM INVITE CODE</span>
                    <span className="text-xl font-mono font-bold text-[#00F0FF] tracking-widest">{generatedInviteCode}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTournament(null)}
                    className="px-4 py-2 bg-[#0B0E14] text-[#8A99AD] rounded text-xs hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00F0FF] text-black font-bold rounded text-xs hover:bg-[#00F0FF]/90"
                  >
                    Create Squad & Get Code
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: JOIN VIA CODE */}
            {modalTab === "join" && (
              <div className="space-y-4">
                <form onSubmit={handleFindTeamByCode} className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#8A99AD] mb-1">Enter Team Invite Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputInviteCode}
                        onChange={(e) => setInputInviteCode(e.target.value)}
                        placeholder="e.g. A3B9X2"
                        className="flex-1 bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white uppercase tracking-wider focus:outline-none focus:border-[#00F0FF]"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#232D3F] hover:bg-[#00F0FF] hover:text-black text-white rounded text-xs font-bold transition-all"
                      >
                        Find Team
                      </button>
                    </div>
                  </div>
                </form>

                {foundTeam && (
                  <form onSubmit={handleJoinTeam} className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF]/30 space-y-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{foundTeam.name}</h4>
                      <p className="text-xs text-[#8A99AD]">Captain: {foundTeam.captainBattleTag} | Current Members: {foundTeam.players?.length || 0}/7</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSubSlot}
                          onChange={(e) => setIsSubSlot(e.target.checked)}
                          className="rounded border-[#232D3F]"
                        />
                        Join as Substitute (Sub Slot)
                      </label>
                    </div>

                    {!isSubSlot && (
                      <div>
                        <label className="block text-xs text-[#8A99AD] mb-1">Select Role Slot</label>
                        <select
                          value={joinRole}
                          onChange={(e) => setJoinRole(e.target.value)}
                          className="w-full bg-[#141A24] border border-[#232D3F] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                        >
                          <option value="tank">Tank</option>
                          <option value="dps">DPS</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                    )}

                    <div className="bg-[#141A24] p-2.5 rounded border border-[#232D3F] text-xs text-[#8A99AD]">
                      Joining as: <span className="text-[#00F0FF]">{user?.battleTag || "Not Set"}</span> ({user?.sr || 2500} SR)
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#00F0FF] text-black font-bold rounded text-xs hover:bg-[#00F0FF]/90 transition-all"
                    >
                      Confirm & Join Roster Slot
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