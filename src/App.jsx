import React, { useState, useEffect } from "react";
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

  // Automatically transition to Back Office when signing in as Admin
  useEffect(() => {
    if (isAdmin) {
      setActiveTab("admin");
    }
  }, [isAdmin]);

  const handleTabChange = (tab) => {
    if (tab === "login" || tab === "auth") {
      setIsAuthModalOpen(true);
      return;
    }

    // Protect Back Office from non-admin users
    if (tab.startsWith("admin") && !isAdmin) {
      setIsAuthModalOpen(true);
      return;
    }

    setActiveTab(tab);
  };

  const renderAdminContent = () => {
    switch (activeAdminTab) {
      case "admin-dashboard":
        return <AdminDashboard />;
      case "admin-tournaments":
        return <TournamentManager />;
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
      return (
        <main className="max-w-7xl mx-auto p-6">
          <PlayerProfile />
        </main>
      );
    }

    if (activeTab === "leaderboard") {
      return (
        <main className="max-w-7xl mx-auto p-6">
          <Leaderboard />
        </main>
      );
    }

    if (activeTab.startsWith("admin")) {
      if (!isAdmin) {
        return (
          <main className="max-w-7xl mx-auto p-12 text-center">
            <div className="bg-[#141A24] border border-red-500/30 p-8 rounded-xl max-w-md mx-auto space-y-4">
              <h3 className="text-xl font-bold text-red-400">ACCESS RESTRICTED</h3>
              <p className="text-xs text-[#8A99AD]">
                Administrator privileges are required to view the Back Office.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#00F0FF] text-black font-bold px-4 py-2 rounded text-xs hover:bg-[#00F0FF]/90 transition-all"
              >
                Sign In as Admin
              </button>
            </div>
          </main>
        );
      }

      return (
        <div className="flex flex-1 w-full min-h-[calc(100vh-73px)]">
          <AdminSidebar activeAdminTab={activeAdminTab} setActiveAdminTab={setActiveAdminTab} />
          <main className="flex-1 p-6 bg-[#0B0E14] overflow-y-auto">
            {renderAdminContent()}
          </main>
        </div>
      );
    }

    return (
      <main className="max-w-7xl mx-auto p-6">
        <TournamentHub />
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col font-sans">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        onTabChange={handleTabChange}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
      {renderContent()}
      <AuthModal
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAdminSuccess={() => setActiveTab("admin")}
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