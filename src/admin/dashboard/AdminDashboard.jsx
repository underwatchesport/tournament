import React from "react";
import { useTournaments } from "../../context/TournamentContext.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

export const AdminDashboard = () => {
  const { tournaments } = useTournaments();
  const { disputes, sanctions } = useAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#FFD100]">OPERATIONAL DASHBOARD</h2>
        <p className="text-xs text-[#8A99AD]">System health, ongoing tournaments, and priority alert metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141A24] border border-[#232D3F] p-4 rounded-xl">
          <div className="text-xs text-[#8A99AD]">Active Tournaments</div>
          <div className="text-2xl font-bold text-white mt-1">{tournaments.length}</div>
        </div>

        <div className="bg-[#141A24] border border-[#232D3F] p-4 rounded-xl">
          <div className="text-xs text-[#8A99AD]">Pending Disputes</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {disputes.filter((d) => d.status === "OPEN").length}
          </div>
        </div>

        <div className="bg-[#141A24] border border-[#232D3F] p-4 rounded-xl">
          <div className="text-xs text-[#8A99AD]">Issued Sanctions</div>
          <div className="text-2xl font-bold text-[#FFD100] mt-1">{sanctions.length}</div>
        </div>

        <div className="bg-[#141A24] border border-[#232D3F] p-4 rounded-xl">
          <div className="text-xs text-[#8A99AD]">Server Operations</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">99.9%</div>
        </div>
      </div>
    </div>
  );
};