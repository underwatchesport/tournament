import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TournamentProvider } from "./context/TournamentContext.jsx";
import { Navigation } from "./components/Navigation.jsx";
import { TournamentHub } from "./features/tournaments/TournamentHub.jsx";
import { BattleTagModal } from "./components/BattleTagModal.jsx";

export default function App() {
  return (
    <AuthProvider>
      <TournamentProvider>
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans antialiased">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <TournamentHub />
          </main>
          <BattleTagModal />
        </div>
      </TournamentProvider>
    </AuthProvider>
  );
}