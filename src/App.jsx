import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { TournamentProvider } from "./context/TournamentContext.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { AdminSidebar } from "./components/layout/AdminSidebar.jsx";
import { AuthModal } from "./features/auth/AuthModal.jsx";
import { PlayerProfile } from "./features/player-profile/PlayerProfile.jsx";

const AppContent = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("tournaments");
  const [activeAdminTab, setActiveAdminTab] = useState("admin-dashboard");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === "login") {
      setIsAuthModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return <PlayerProfile />;
    }

    if (activeTab.startsWith("admin")) {
      if (!isAdmin) {
        return (
          <div className="p-12 text-center text-red-400">
            Access Restricted. Please log in with admin credentials (`admin` / `admin`).
          </div>
        );
      }

      return (
        <div className="flex flex-1 w-full min-h-[calc(100vh-73px)]">
          <AdminSidebar activeAdminTab={activeAdminTab} setActiveAdminTab={setActiveAdminTab} />
          <main className="flex-1 p-6 bg-[#0B0E14] overflow-y-auto">
            <div className="p-6 bg-[#141A24] rounded-xl border border-[#232D3F]">
              <h2 className="text-xl font-bold text-[#FFD100] mb-2 uppercase">
                {activeAdminTab.replace("admin-", "").toUpperCase()} MODULE
              </h2>
              <p className="text-[#8A99AD] text-sm">
                Active Module: <span className="text-[#00F0FF]">{activeAdminTab}</span>. Feature components loading in Phase 4.
              </p>
            </div>
          </main>
        </div>
      );
    }

    return (
      <main className="max-w-7xl mx-auto p-6">
        <div className="p-8 bg-[#141A24] rounded-xl border border-[#232D3F]">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Underwatch Portal</h1>
          <p className="text-[#8A99AD]">
            Current Section: <span className="text-[#00F0FF] font-semibold">{activeTab}</span>
          </p>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
      {renderContent()}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <TournamentProvider>
          <AppContent />
        </TournamentProvider>
      </AdminProvider>
    </AuthProvider>
  );
}