import React from "react";

export const Leaderboard = () => {
  const standings = [
    { rank: 1, team: "Cyber Foxes", wins: 14, losses: 2, winRate: "87.5%", circuitPoints: 1250 },
    { rank: 2, team: "Payload Pirates", wins: 12, losses: 4, winRate: "75.0%", circuitPoints: 980 },
    { rank: 3, team: "Support Mafia", wins: 10, losses: 6, winRate: "62.5%", circuitPoints: 750 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#141A24] border border-[#232D3F] p-6 rounded-xl">
        <h2 className="text-xl font-bold text-[#FFD100]">CIRCUIT STANDINGS & LEADERBOARD</h2>
        <p className="text-xs text-[#8A99AD]">Global Underwatch competitive circuit points and team win-rates.</p>
      </div>

      <div className="bg-[#141A24] border border-[#232D3F] rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B0E14] text-[#8A99AD] uppercase border-b border-[#232D3F]">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Team Name</th>
              <th className="p-4">Wins</th>
              <th className="p-4">Losses</th>
              <th className="p-4">Win Rate</th>
              <th className="p-4 text-right">Circuit Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232D3F]">
            {standings.map((s) => (
              <tr key={s.rank} className="hover:bg-[#0B0E14]/40">
                <td className="p-4 font-bold text-[#FFD100]">#{s.rank}</td>
                <td className="p-4 font-bold text-white">{s.team}</td>
                <td className="p-4 text-emerald-400">{s.wins}</td>
                <td className="p-4 text-red-400">{s.losses}</td>
                <td className="p-4 text-white">{s.winRate}</td>
                <td className="p-4 text-right font-mono text-[#00F0FF]">{s.circuitPoints} PTS</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};