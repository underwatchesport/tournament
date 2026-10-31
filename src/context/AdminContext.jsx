import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [disputes, setDisputes] = useState([
    {
      id: "dsp_001",
      tournamentName: "Underwatch Season 1 Kickoff",
      matchId: "m_102",
      reportingTeam: "Cyber Foxes",
      opposingTeam: "Payload Pirates",
      reason: "Incorrect Score Reported",
      status: "OPEN",
      timestamp: "2026-03-29 18:45",
      evidenceUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
      replayCode: "OW2-882A91",
      notes: "Opponent claims they won King's Row 3-2, but scoreboard image shows 3-1."
    }
  ]);

  const [sanctions, setSanctions] = useState([
    {
      id: "sanc_001",
      targetName: "ToxicReaper#1999",
      type: "WARNING",
      reason: "Unsportsmanlike Conduct in Match Lobby",
      issuedBy: "Admin",
      date: "2026-03-25"
    }
  ]);

  const resolveDispute = (disputeId, ruling, adminNote) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? { ...d, status: "RESOLVED", ruling, resolutionNotes: adminNote }
          : d
      )
    );
  };

  const issueSanction = (targetName, type, reason) => {
    const newSanction = {
      id: `sanc_${Date.now()}`,
      targetName,
      type,
      reason,
      issuedBy: "Admin",
      date: new Date().toISOString().split("T")[0]
    };
    setSanctions((prev) => [newSanction, ...prev]);
  };

  return (
    <AdminContext.Provider
      value={{
        disputes,
        sanctions,
        resolveDispute,
        issueSanction
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);