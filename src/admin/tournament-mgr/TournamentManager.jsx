import React, { useState } from "react";
import { useTournaments } from "../../context/TournamentContext.jsx";
import { TOURNAMENT_FORMATS } from "../../utils/constants.js";
import { OVERWATCH_MAPS } from "../../utils/owMaps.js";

export const TournamentManager = () => {
  const { tournaments, createTournament } = useTournaments();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState(TOURNAMENT_FORMATS[0]);
  const [maxSR, setMaxSR] = useState(3500);
  const [prizePool, setPrizePool] = useState("$1,000");
  const [maxTeams, setMaxTeams] = useState(16);
  const [startDate, setStartDate] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    createTournament({
      title,
      format,
      maxSR: parseInt(maxSR, 10),
      prizePool,
      maxTeams: parseInt(maxTeams, 10),
      startDate
    });
    setShowModal(false);
    setTitle("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#FFD100]">TOURNAMENT MANAGER</h2>
          <p className="text-xs text-[#8A99AD]">Create, modify formats, and oversee tournament brackets.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#00F0FF] text-black font-bold px-4 py-2 rounded-md text-sm hover:bg-[#00F0FF]/90 transition-all"
        >
          + Create New Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tournaments.map((trn) => (
          <div key={trn.id} className="bg-[#141A24] border border-[#232D3F] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-semibold rounded border border-[#00F0FF]/30">
                  {trn.status}
                </span>
                <h3 className="text-lg font-bold text-white">{trn.title}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#8A99AD] mt-2">
                <span>Format: <strong className="text-white">{trn.format}</strong></span>
                <span>Max SR: <strong className="text-[#FFD100]">{trn.maxSR} SR</strong></span>
                <span>Prize Pool: <strong className="text-emerald-400">{trn.prizePool}</strong></span>
                <span>Teams Registered: <strong className="text-white">{trn.registeredTeams?.length || 0} / {trn.maxTeams}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="bg-[#0B0E14] text-[#8A99AD] hover:text-white border border-[#232D3F] px-3 py-1.5 rounded-md text-xs font-medium">
                Edit Rules
              </button>
              <button className="bg-[#FFD100] text-black font-bold px-3 py-1.5 rounded-md text-xs hover:bg-[#FFD100]/90">
                Manage Bracket
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-[#FFD100]">Launch New Tournament</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8A99AD] mb-1">Tournament Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Underwatch Master Cup #1"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white"
                  >
                    {TOURNAMENT_FORMATS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">SR Cap</label>
                  <input
                    type="number"
                    value={maxSR}
                    onChange={(e) => setMaxSR(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8A99AD] mb-1">Max Teams</label>
                  <input
                    type="number"
                    value={maxTeams}
                    onChange={(e) => setMaxTeams(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8A99AD] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-sm text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#0B0E14] text-[#8A99AD] rounded text-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F0FF] text-black font-bold rounded text-sm hover:bg-[#00F0FF]/90"
                >
                  Publish Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};