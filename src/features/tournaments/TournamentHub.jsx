import React, { useState } from "react";
import { useTournaments } from "../../context/TournamentContext.jsx";
import { validateTeamEligibility } from "../../utils/srValidators.js";

export const TournamentHub = () => {
  const { tournaments, registerTeamForTournament } = useTournaments();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [viewingTeamsTournament, setViewingTeamsTournament] = useState(null);
  
  // Registration Form State
  const [teamName, setTeamName] = useState("");
  const [roster, setRoster] = useState([
    { name: "TankPlayer", role: "tank", battleTag: "Tank#1234", discordTag: "Tank#0001", sr: 3000 },
    { name: "DPSPlayer1", role: "dps", battleTag: "DPS1#1234", discordTag: "DPS1#0002", sr: 2900 },
    { name: "DPSPlayer2", role: "dps", battleTag: "DPS2#1234", discordTag: "DPS2#0003", sr: 2850 },
    { name: "SupPlayer1", role: "support", battleTag: "Sup1#1234", discordTag: "Sup1#0004", sr: 2950 },
    { name: "SupPlayer2", role: "support", battleTag: "Sup2#1234", discordTag: "Sup2#0005", sr: 2900 }
  ]);
  const [formErrors, setFormErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage("");

    const teamPayload = {
      id: `tm_${Date.now()}`,
      name: teamName,
      players: roster,
      captainBattleTag: roster[0].battleTag,
      captainDiscord: roster[0].discordTag
    };

    const validation = validateTeamEligibility(teamPayload, selectedTournament.maxSR);
    if (!validation.isEligible) {
      setFormErrors(validation.errors);
      return;
    }

    registerTeamForTournament(selectedTournament.id, teamPayload);
    setSuccessMessage("Successfully registered team for tournament!");
    setTimeout(() => {
      setSelectedTournament(null);
      setSuccessMessage("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#FFD100]">UNDERWATCH TOURNAMENT HUB</h2>
          <p className="text-xs text-[#8A99AD]">Browse active Overwatch 2 tournaments, view registered squads, and sign up.</p>
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
                Join Tournament
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PUBLIC TEAMS LIST MODAL */}
      {viewingTeamsTournament && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#232D3F]">
              <div>
                <h3 className="text-lg font-bold text-[#FFD100]">Registered Teams</h3>
                <p className="text-xs text-[#8A99AD]">{viewingTeamsTournament.title}</p>
              </div>
              <button onClick={() => setViewingTeamsTournament(null)} className="text-[#8A99AD] hover:text-white font-bold">✕</button>
            </div>

            {(!viewingTeamsTournament.registeredTeams || viewingTeamsTournament.registeredTeams.length === 0) ? (
              <p className="text-xs text-[#8A99AD] text-center py-6">No teams have registered for this tournament yet. Be the first to join!</p>
            ) : (
              <div className="space-y-4">
                {viewingTeamsTournament.registeredTeams.map((team, idx) => (
                  <div key={team.id || idx} className="bg-[#0B0E14] border border-[#232D3F] p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-md">{team.name}</h4>
                      <span className="text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-mono">
                        Avg SR: {team.averageSR || 3000}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {team.players?.map((p, pIdx) => (
                        <div key={pIdx} className="bg-[#141A24] p-2 rounded border border-[#232D3F] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#FFD100] font-bold uppercase mr-1.5">[{p.role}]</span>
                            <span className="text-white font-medium">{p.name || p.battleTag}</span>
                          </div>
                          <span className="text-[11px] text-[#00F0FF] font-mono">{p.battleTag}</span>
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

      {/* JOIN TOURNAMENT FORM MODAL */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#FFD100]">Join: {selectedTournament.title}</h3>
              <button onClick={() => setSelectedTournament(null)} className="text-[#8A99AD] hover:text-white">✕</button>
            </div>

            {successMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded">{successMessage}</div>}
            {formErrors.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded space-y-1">
                {formErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#8A99AD] mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Payload Pirates"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase">Roster Composition (1 Tank, 2 DPS, 2 Support)</span>
                {roster.map((p, idx) => (
                  <div key={idx} className="p-3 bg-[#0B0E14] border border-[#232D3F] rounded space-y-2 text-xs">
                    <div className="font-bold text-[#00F0FF]">{p.role.toUpperCase()} Slot</div>
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
                        required
                      />
                      <input
                        type="text"
                        value={p.discordTag}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[idx].discordTag = e.target.value;
                          setRoster(updated);
                        }}
                        placeholder="DiscordTag#0001"
                        className="bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-white"
                        required
                      />
                      <input
                        type="number"
                        value={p.sr}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[idx].sr = e.target.value;
                          setRoster(updated);
                        }}
                        placeholder="SR"
                        className="bg-[#141A24] border border-[#232D3F] rounded px-2 py-1 text-white"
                        required
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F0FF] text-black font-bold rounded text-xs hover:bg-[#00F0FF]/90"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};