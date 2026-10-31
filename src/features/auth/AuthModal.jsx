import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithDiscord } = useAuth();

  if (!isOpen) return null;

  const handleDiscordAuth = () => {
    loginWithDiscord();
    onClose();
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

        <button
          onClick={handleDiscordAuth}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 rounded-md text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <span>Connect with Discord</span>
        </button>
      </div>
    </div>
  );
};