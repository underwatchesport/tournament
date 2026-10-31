import React from "react";

export const BroadcastDesk = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#FFD100]">CASTER & BROADCAST DESK</h2>
        <p className="text-xs text-[#8A99AD]">Generate stream overlays, spectator lobby codes, and caster invite links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#141A24] border border-[#232D3F] p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase">Caster Lobby Links</h3>
          <div className="p-3 bg-[#0B0E14] rounded border border-[#232D3F] text-xs space-y-2">
            <div className="text-[#8A99AD]">Spectator Key Code:</div>
            <div className="text-[#00F0FF] font-mono font-bold bg-black/50 p-2 rounded border border-[#00F0FF]/30 select-all">
              SPECTATE-OW2-UNDERWATCH-9941
            </div>
            <p className="text-[11px] text-[#8A99AD]">Share this key with assigned casters to grant spectator privileges.</p>
          </div>
        </div>

        <div className="bg-[#141A24] border border-[#232D3F] p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase">OBS Stream Overlay URL</h3>
          <div className="p-3 bg-[#0B0E14] rounded border border-[#232D3F] text-xs space-y-2">
            <div className="text-[#8A99AD]">Lower-Third Overlay Feed:</div>
            <div className="text-[#FFD100] font-mono text-[11px] bg-black/50 p-2 rounded border border-[#FFD100]/30 truncate">
              https://underwatch.gg/overlay/live-bracket-feed?t=trn_001
            </div>
            <p className="text-[11px] text-[#8A99AD]">Paste directly into OBS Browser Source for live match HUD overlays.</p>
          </div>
        </div>
      </div>
    </div>
  );
};