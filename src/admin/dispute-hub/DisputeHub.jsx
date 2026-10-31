import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";

export const DisputeHub = () => {
  const { disputes, resolveDispute } = useAdmin();
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  const handleResolve = (ruling) => {
    if (!selectedDispute) return;
    resolveDispute(selectedDispute.id, ruling, adminNote);
    setSelectedDispute(null);
    setAdminNote("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#FFD100]">MATCH DISPUTE & MODERATION HUB</h2>
        <p className="text-xs text-[#8A99AD]">Review player ticket evidence, replay codes, and issue binding rulings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Active Dispute Tickets</h3>
          {disputes.length === 0 ? (
            <div className="p-4 bg-[#141A24] border border-[#232D3F] text-xs text-[#8A99AD] rounded-lg">
              No active dispute tickets.
            </div>
          ) : (
            disputes.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDispute(d)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDispute?.id === d.id
                    ? "bg-[#141A24] border-[#00F0FF] shadow-lg"
                    : "bg-[#141A24]/60 border-[#232D3F] hover:border-[#8A99AD]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    d.status === "OPEN" ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {d.status}
                  </span>
                  <span className="text-[10px] text-[#8A99AD]">{d.timestamp}</span>
                </div>
                <div className="font-bold text-white text-sm mt-2">{d.reason}</div>
                <div className="text-xs text-[#8A99AD] mt-1">
                  Match: <span className="text-white">{d.reportingTeam}</span> vs <span className="text-white">{d.opposingTeam}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedDispute ? (
            <div className="bg-[#141A24] border border-[#232D3F] p-5 rounded-xl space-y-4">
              <h3 className="text-md font-bold text-[#FFD100]">Dispute Evidence Review</h3>
              
              <div className="text-xs space-y-1 text-[#8A99AD] bg-[#0B0E14] p-3 rounded border border-[#232D3F]">
                <div>Reporting Team: <strong className="text-white">{selectedDispute.reportingTeam}</strong></div>
                <div>Opponent Team: <strong className="text-white">{selectedDispute.opposingTeam}</strong></div>
                <div>Replay Code: <strong className="text-[#00F0FF] font-mono">{selectedDispute.replayCode}</strong></div>
                <div>Statement: <p className="text-white mt-1 italic">"{selectedDispute.notes}"</p></div>
              </div>

              {selectedDispute.evidenceUrl && (
                <div>
                  <span className="block text-xs font-semibold text-[#8A99AD] mb-1">Uploaded Screenshot Evidence:</span>
                  <img
                    src={selectedDispute.evidenceUrl}
                    alt="Evidence"
                    className="w-full h-48 object-cover rounded border border-[#232D3F]"
                  />
                </div>
              )}

              {selectedDispute.status === "OPEN" && (
                <div className="space-y-3 pt-2">
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter ruling explanation or warning details..."
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                    rows="3"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(`Win awarded to ${selectedDispute.reportingTeam}`)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded text-xs"
                    >
                      Award Win to {selectedDispute.reportingTeam}
                    </button>
                    <button
                      onClick={() => handleResolve("Map Rematch Ordered")}
                      className="flex-1 bg-[#FFD100] hover:bg-[#FFD100]/90 text-black font-bold py-2 rounded text-xs"
                    >
                      Order Map Rematch
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#141A24]/40 border border-[#232D3F] p-8 rounded-xl text-center text-xs text-[#8A99AD]">
              Select a dispute ticket from the left panel to inspect evidence and submit rulings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};