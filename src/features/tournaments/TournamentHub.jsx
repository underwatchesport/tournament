import React, { useState, useEffect } from "react";
import { useTournaments } from "../../context/TournamentContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateTeamEligibility } from "../../utils/srValidators.js";

export const TournamentHub = () => {
  const { tournaments, registerTeamForTournament } = useTournaments();
  const { user } = useAuth();
  
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [viewingTeamsTournament, setViewingTeamsTournament] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);

  // Roster includes 5 starting roles + optional sub slots
  const [roster, setRoster] = useState([
    { role: "tank", battleTag: "", discordTag: "", sr: 2500, isSub: false },
    { role: "dps", battleTag: "", discordTag: "", sr: 2500, isSub: false },
    { role: "dps", battleTag: "", discordTag: "", sr: 2500, isSub: false },
    { role: "support", battleTag: "", discordTag: "", sr: 2500, isSub: false },
    { role: "support", battleTag: "", discordTag: "", sr: 2500, isSub: false },
    { role: "sub", battleTag: "", discordTag: "", sr: 2500, isSub: true },
    { role: "sub", battleTag: "", discordTag: "", sr: 2500, isSub: true }
  ]);

  // Auto-fill captain info when modal opens
  useEffect(() => {
    if (selectedTournament && user) {
      setRoster((prev) => {
        const next = [...prev];
        const targetIdx = next.findIndex(p => p.role === (user.primaryRole || "dps") && !p.isSub) !== -1 
          ? next.findIndex(p => p.role === (user.primaryRole || "dps") && !p.isSub)
          : 0;

        next[targetIdx] = {
          ...next[targetIdx],
          battleTag: user.battleTag || "",
          discordTag: user.discordTag || user.username || "",
          sr: user.sr || 2500
        };
        return next;
      });
    }
  }, [selectedTournament, user]);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage("");

    // Validate active players (excluding empty optional sub slots)
    const activePlayers = roster.filter(p => p.battleTag.trim() !== "");
    const mainStarters = activePlayers.filter(p => !p.isSub);

    if (mainStarters.length < 5) {
      setFormErrors(["Starting roster requires at least 5 main players (1 Tank, 2 DPS, 2 Support)."]);
      return;
    }

    const teamPayload = {
      id: `tm_${Date.now()}`,
      name: teamName,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      players: activePlayers,
      captainBattleTag: user?.battleTag || activePlayers[0].battleTag,
      captainDiscord: user?.discordTag || activePlayers[0].discordTag
    };

    const validation = validateTeamEligibility(teamPayload, selectedTournament.maxSR);
    if (!validation.isEligible) {
      setFormErrors(validation.errors);
      return;
    }

    registerTeamForTournament(selectedTournament.id, teamPayload);
    setInviteCode(teamPayload.inviteCode);
    setSuccessMessage(`Team "${teamName}" created! Share invite code with teammates: ${teamPayload.inviteCode}`);
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
                onClick={() => setSelectedTournament(trn)}
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
                          <span className="text-[10px] bg-[#232D3F] text-[#8A99AD] px-2 py-0.5 rounded">
                            Invite Code: {team.inviteCode}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-mono">
                        Avg SR: {team.averageSR || 2500}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {team.players?.map((p, pIdx) => (
                        <div key={pIdx} className={`p-2 rounded border flex items-center justify-between ${p.isSub ? "bg-[#1A202C] border-dashed border-[#8A99AD]/40" : "bg-[#141A24] border-[#232D3F]"}`}>
                          <div>
                            <span className={`text-[10px] font-bold uppercase mr-1.5 ${p.isSub ? "text-purple-400" : "text-[#FFD100]"}`}>
                              [{p.isSub ? "SUB" : p.role}]
                            </span>
                            <span className="text-white font-medium">{p.battleTag}</span>
                          </div>
                          <span className="text-[11px] text-[#00F0FF] font-mono">{p.sr} SR</span>
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
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#FFD100]">Register Squad: {selectedTournament.title}</h3>
              <button onClick={() => setSelectedTournament(null)} className="text-[#8A99AD] hover:text-white">✕</button>
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

              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase">Roster & Substitutes</span>
                {roster.map((p, idx) => (
                  <div key={idx} className={`p-3 rounded border space-y-2 text-xs ${p.isSub ? "bg-[#0B0E14]/60 border-dashed border-[#8A99AD]/40" : "bg-[#0B0E14] border-[#232D3F]"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${p.isSub ? "text-purple-400" : "text-[#00F0FF]"}`}>
                        {p.isSub ? `SUBSTITUTE SLOT #${idx - 4}` : `${p.role.toUpperCase()} SLOT`}
                      </span>
                      {user && idx === 0 && (
                        <span className="text-[10px] text-[#FFD100] bg-[#FFD100]/10 px-1.5 py-0.5 rounded">Captain (Auto-Filled)</span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={p.battleTag}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[idx].battleTag = e.target.value;
                          setRoster(updated);
                        }}
                        placeholder="BattleTag#1234"
                        className="bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-white"
                        required={!p.isSub}
                      />
                      <input
                        type="text"
                        value={p.discordTag}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[idx].discordTag = e.target.value;
                          setRoster(updated);
                        }}
                        placeholder="Discord Handle"
                        className="bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-white"
                        required={!p.isSub}
                      />
                      <input
                        type="number"
                        value={p.sr}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[idx].sr = parseInt(e.target.value, 10) || 0;
                          setRoster(updated);
                        }}
                        placeholder="SR"
                        className="bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-white"
                        required={!p.isSub}
                      />
                    </div>
                  </div>
                ))}
              </div>

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
                  Register Team & Generate Invite Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};