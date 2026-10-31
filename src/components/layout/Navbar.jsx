import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export const Navbar = ({ activeTab, setActiveTab, onTabChange, onOpenAuth }) => {
  const { user, isAdmin, logout } = useAuth();

  const handleTabClick = (tab) => {
    if (onTabChange) onTabChange(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  return (
    <nav className="bg-[#141A24] border-b border-[#232D3F] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl font-black text-[#FFD100] tracking-wider">UNDERWATCH</span>
        <span className="text-xs text-[#8A99AD] uppercase tracking-widest font-mono">ESPORTS OPERATIONS</span>
      </div>

      <div className="flex items-center bg-[#0B0E14] p-1 rounded-lg border border-[#232D3F]">
        <button
          onClick={() => handleTabClick("tournaments")}
          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
            activeTab === "tournaments" ? "bg-[#00F0FF] text-black" : "text-[#8A99AD] hover:text-white"
          }`}
        >
          Tournaments
        </button>
        
        {/* Back Office Tab Rendered Exclusively for Admins */}
        {isAdmin && (
          <button
            onClick={() => handleTabClick("admin")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "admin" ? "bg-[#FFD100] text-black" : "text-[#FFD100] hover:text-white"
            }`}
          >
            Back Office
          </button>
        )}
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
              alt={user.username}
              className="w-8 h-8 rounded-full border border-[#00F0FF]"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white">{user.username}</div>
              <div className="text-[10px] text-[#00F0FF] font-mono">{isAdmin ? "Admin Account" : user.battleTag}</div>
            </div>
            <button
              onClick={() => {
                logout();
                handleTabClick("tournaments");
              }}
              className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 px-3 py-1.5 rounded transition-all font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-bold px-4 py-2 rounded text-xs transition-all"
          >
            Sign In / Register
          </button>
        )}
      </div>
    </nav>
  );
};