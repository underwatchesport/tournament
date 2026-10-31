import React, { createContext, useContext, useState, useEffect } from "react";

const TournamentContext = createContext();

const initialTournaments = [
  {
    id: "trn_1",
    title: "Underwatch Season 1 Kickoff",
    status: "UPCOMING",
    format: "Single Elimination",
    maxSR: 3500,
    prizePool: "$1,500",
    maxTeams: 16,
    registeredTeams: []
  }
];

export const TournamentProvider = ({ children }) => {
  // Load saved tournaments/teams from localStorage on initial load
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem("underwatch_tournaments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved tournaments", err);
      }
    }
    return initialTournaments;
  });

  // Save to localStorage whenever tournaments change
  useEffect(() => {
    localStorage.setItem("underwatch_tournaments", JSON.stringify(tournaments));
  }, [tournaments]);

  // Register a new team to a tournament
  const registerTeamForTournament = (tournamentId, newTeam) => {
    setTournaments((prevTournaments) =>
      prevTournaments.map((trn) => {
        if (trn.id === tournamentId) {
          const existingTeams = trn.registeredTeams || [];
          return {
            ...trn,
            registeredTeams: [...existingTeams, newTeam]
          };
        }
        return trn;
      })
    );
  };

  // Update a team's roster when new players/subs join via invite code
  const updateTeamRoster = (tournamentId, teamId, updatedPlayers) => {
    setTournaments((prevTournaments) =>
      prevTournaments.map((trn) => {
        if (trn.id === tournamentId) {
          const updatedTeams = (trn.registeredTeams || []).map((t) => {
            if (t.id === teamId) {
              return { ...t, players: updatedPlayers };
            }
            return t;
          });
          return { ...trn, registeredTeams: updatedTeams };
        }
        return trn;
      })
    );
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        registerTeamForTournament,
        updateTeamRoster
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = () => useContext(TournamentContext);