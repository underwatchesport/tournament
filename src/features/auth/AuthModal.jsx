import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { validateBattleTag } from "../../utils/srValidators.js";

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithEmail, loginWithDiscord, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration State
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regBattleTag, setRegBattleTag] = useState("");
  const [regDiscordTag, setRegDiscordTag] = useState("");

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError("");
    const res = loginWithEmail(email, password);
    if (res.success) {
      onClose();
    } else {
      setError("Invalid login credentials.");
    }
  };

  const handleDiscordAuth = () => {
    loginWithDiscord();
    onClose();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!validateBattleTag(regBattleTag)) {
      setError("Invalid BattleTag format! Example: Player#1234");
      return;
    }

    if (!regDiscordTag.trim()) {
      setError("Discord tag is required.");
      return;
    }

    signUp(regUsername, regEmail, regBattleTag, regDiscordTag);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#141A24] border border-[#232D3F] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A99AD] hover:text-white font-bold text-lg"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#FFD100] tracking-wide">
            {isSignUp ? "JOIN UNDERWATCH" : "SIGN IN"}
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

        {!isSignUp ? (
          <div>
            <button
              onClick={handleDiscordAuth}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2.5 px-4 rounded-md text-sm flex items-center justify-center gap-2 mb-4 transition-all"
            >
              <span>Connect with Discord</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-[#232D3F]"></div>
              <span className="px-3 text-xs text-[#8A99AD] uppercase">Or login with email</span>
              <div className="flex-1 border-t border-[#232D3F]"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A99AD] mb-1">Email / Admin Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin or user@email.com"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A99AD] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00F0FF] text-black font-bold py-2.5 rounded-md text-sm hover:bg-[#00F0FF]/90 transition-all mt-2"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-[#8A99AD]">
              Don't have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-[#00F0FF] hover:underline font-semibold"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#8A99AD] mb-1">Username</label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="TracerGod"
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A99AD] mb-1">Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="tracer@underwatch.gg"
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A99AD] mb-1">
                Overwatch BattleTag <span className="text-[#00F0FF]">*</span>
              </label>
              <input
                type="text"
                value={regBattleTag}
                onChange={(e) => setRegBattleTag(e.target.value)}
                placeholder="Tracer#12345"
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A99AD] mb-1">
                Discord Tag <span className="text-[#00F0FF]">*</span>
              </label>
              <input
                type="text"
                value={regDiscordTag}
                onChange={(e) => setRegDiscordTag(e.target.value)}
                placeholder="tracer_ow"
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFD100] text-black font-bold py-2.5 rounded-md text-sm hover:bg-[#FFD100]/90 transition-all mt-2"
            >
              Register Account
            </button>

            <div className="mt-3 text-center text-xs text-[#8A99AD]">
              Already registered?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-[#00F0FF] hover:underline font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};