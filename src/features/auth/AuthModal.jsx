import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithDiscord, loginWithEmail } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleDiscordAuth = () => {
    loginWithDiscord();
    onClose();
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");

    const res = loginWithEmail(adminUsername, adminPassword);
    if (res && res.success) {
      onClose();
    } else {
      setError("Invalid administrator credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#141A24] border border-[#232D3F] rounded-xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A99AD] hover:text-white font-bold text-lg"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#FFD100] tracking-wide">
            SIGN IN TO UNDERWATCH
          </h2>
          <p className="text-xs text-[#8A99AD] mt-1">
            Overwatch 2 Esports Operations & Tournaments
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Main Discord Button */}
          <button
            onClick={handleDiscordAuth}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 rounded-md text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>Connect with Discord</span>
          </button>

          {!showAdminLogin ? (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowAdminLogin(true)}
                className="text-xs text-[#8A99AD] hover:text-[#00F0FF] underline transition-all"
              >
                Admin Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-3 pt-2 border-t border-[#232D3F]">
              <span className="text-xs font-bold text-[#FFD100] uppercase block text-center">Administrator Access</span>
              <div>
                <label className="block text-xs text-[#8A99AD] mb-1">Username / Email</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#8A99AD] mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00F0FF] text-black font-bold rounded text-xs hover:bg-[#00F0FF]/90 transition-all"
              >
                Sign In as Admin
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setShowAdminLogin(false); setError(""); }}
                  className="text-[10px] text-[#8A99AD] hover:underline"
                >
                  Cancel Admin Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};