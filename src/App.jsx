import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { TournamentProvider } from "./context/TournamentContext.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { AdminSidebar } from "./components/layout/AdminSidebar.jsx";
import { AuthModal } from "./features/auth/AuthModal.jsx";
import { PlayerProfile } from "./features/player-profile/PlayerProfile.jsx";
import { BattleTagModal } from "./components/BattleTagModal.jsx";

// Public Imports
import { TournamentHub } from "./features/tournaments/TournamentHub.jsx";
import { TeamBuilder } from "./features/teams/TeamBuilder.jsx";
import { Leaderboard } from "./features/leaderboards/Leaderboard.jsx";

// Back Office Imports
import { AdminDashboard } from "./admin/dashboard/AdminDashboard.jsx";
import { TournamentManager } from "./admin/tournament-mgr/TournamentManager.jsx";
import { DisputeHub } from "./admin/dispute-hub/DisputeHub.jsx";
import { UserManagement } from "./admin/user-management/UserManagement.jsx";
import { BroadcastDesk } from "./admin/broadcast-desk/BroadcastDesk.jsx";

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

  const renderAdminContent = () => {
    switch (activeAdminTab) {
      case "admin-dashboard":
        return <AdminDashboard />;
      case "admin-tournaments":
        return <TournamentManager />;
      case "admin-[#disputes]":
      case "admin-disputes":
        return <DisputeHub />;
      case "admin-users":
        return <UserManagement />;
      case "admin-broadcast":
        return <BroadcastDesk />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return <PlayerProfile />;
    }
    if (activeTab === "teams") {
      return <TeamBuilder />;
    }
    if (activeTab === "leaderboard") {
      return <Leaderboard />;
    }
    return <TournamentHub />;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col font-sans antialiased">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex">
        {isAdmin && (
          <AdminSidebar
            activeTab={activeAdminTab}
            onTabChange={setActiveAdminTab}
          />
        )}

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {isAdmin && activeAdminTab.startsWith("admin-")
            ? renderAdminContent()
            : renderContent()}
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <BattleTagModal />
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