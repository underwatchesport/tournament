import React, { createContext, useContext, useState } from "react";

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([
    {
      id: "trn_001",
      title: "Underwatch Season 1 Kickoff",
      format: "Single Elimination",
      maxSR: 3500,
      prizePool: "$1,500",
      status: "UPCOMING",
      startDate: "2026-04-10",
      maxTeams: 16,
      registeredTeams: [
        {
          id: "tm_01",
          name: "Cyber Foxes",
          captainBattleTag: "FoxLeader#1111",
          captainDiscord: "FoxLeader#0001",
          averageSR: 3420,
          players: [
            { name: "ApexTank", role: "tank", battleTag: "ApexTank#1234", discordTag: "Apex#1111", sr: 3450 },
            { name: "ViperDPS", role: "dps", battleTag: "ViperDPS#2345", discordTag: "Viper#2222", sr: 3410 },
            { name: "ShadowDPS", role: "dps", battleTag: "ShadowDPS#3456", discordTag: "Shadow#3333", sr: 3390 },
            { name: "AuraSupport", role: "support", battleTag: "AuraSup#4567", discordTag: "Aura#4444", sr: 3430 },
            { name: "ZenMaster", role: "support", battleTag: "ZenMaster#5678", discordTag: "Zen#5555", sr: 3420 }
          ]
        }
      ]
    }
  ]);

  const createTournament = (newTournament) => {
    const created = {
      ...newTournament,
      id: `trn_${Date.now()}`,
      registeredTeams: [],
      status: "UPCOMING"
    };
    setTournaments((prev) => [created, ...prev]);
  };

  const registerTeamForTournament = (tournamentId, teamData) => {
    setTournaments((prev) =>
      prev.map((trn) => {
        if (trn.id === tournamentId) {
          return {
            ...trn,
            registeredTeams: [...trn.registeredTeams, teamData]
          };
        }
        return trn;
      })
    );
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        createTournament,
        registerTeamForTournament
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = () => useContext(TournamentContext);