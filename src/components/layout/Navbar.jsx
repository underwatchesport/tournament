import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="w-full bg-[#141A24] border-b border-[#232D3F] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("tournaments")}>
        <div className="w-9 h-9 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF] flex items-center justify-center">
          <svg className="w-5 h-5 text-[#00F0FF]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-wider text-[#FFD100]">UNDERWATCH</span>
          <span className="text-[10px] text-[#00F0FF] tracking-widest font-semibold uppercase">Esports Operations</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-[#0B0E14] p-1.5 rounded-lg border border-[#232D3F]">
        <button
          onClick={() => setActiveTab("tournaments")}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
            activeTab === "tournaments" ? "bg-[#00F0FF] text-black shadow-md" : "text-[#8A99AD] hover:text-white"
          }`}
        >
          Tournaments
        </button>
        <button
          onClick={() => setActiveTab("teams")}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
            activeTab === "teams" ? "bg-[#00F0FF] text-black shadow-md" : "text-[#8A99AD] hover:text-white"
          }`}
        >
          Teams & Rosters
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
            activeTab === "leaderboard" ? "bg-[#00F0FF] text-black shadow-md" : "text-[#8A99AD] hover:text-white"
          }`}
        >
          Leaderboards
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab("admin-dashboard")}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all border ${
              activeTab.startsWith("admin")
                ? "bg-[#FFD100] text-black border-[#FFD100]"
                : "border-[#FFD100]/40 text-[#FFD100] hover:bg-[#FFD100]/10"
            }`}
          >
            🛡️ Admin Back Office
          </button>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border border-[#00F0FF]" />
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white">{user.username}</span>
              <span className="text-xs text-[#00F0FF]">{user.battleTag}</span>
            </div>
            <button
              onClick={logout}
              className="ml-2 text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-md hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab("login")}
            className="bg-[#00F0FF] text-black font-bold px-4 py-2 rounded-md text-sm hover:bg-[#00F0FF]/90 transition-all"
          >
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};