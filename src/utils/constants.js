export const BRAND = {
  name: "Underwatch",
  tagline: "Premier Competitive Overwatch 2 Community",
  logoUrl: "/assets/underwatch-logo.svg",
  colors: {
    cyan: "#00F0FF",
    gold: "#FFD100",
    bgDark: "#0B0E14",
    cardBg: "#141A24",
    border: "#232D3F",
    textMuted: "#8A99AD"
  }
};

export const AUTH_CONFIG = {
  discordClientId: "MOCK_DISCORD_CLIENT_ID",
  adminCredentials: {
    username: "admin",
    password: "admin"
  }
};

export const COMPETITIVE_RANKS = [
  { name: "Bronze", icon: "🟤", minSR: 1, maxSR: 1499 },
  { name: "Silver", icon: "⚪", minSR: 1500, maxSR: 1999 },
  { name: "Gold", icon: "🟡", minSR: 2000, maxSR: 2499 },
  { name: "Platinum", icon: "🔷", minSR: 2500, maxSR: 2999 },
  { name: "Diamond", icon: "💎", minSR: 3000, maxSR: 3499 },
  { name: "Master", icon: "🔮", minSR: 3500, maxSR: 3999 },
  { name: "Grandmaster", icon: "👑", minSR: 4000, maxSR: 4499 },
  { name: "Champion", icon: "⚡", minSR: 4500, maxSR: 5000 }
];

export const TEAM_ROSTER_REQUIREMENTS = {
  tank: 1,
  dps: 2,
  support: 2,
  substitutesMax: 3,
  totalActive: 5
};

export const TOURNAMENT_FORMATS = [
  "Single Elimination",
  "Double Elimination",
  "Swiss",
  "Round Robin"
];

export const DISPUTE_REASONS = [
  "Incorrect Score Reported",
  "Ringer / Unregistered Player",
  "Toxic Behavior / Chat Abuse",
  "Custom Lobby Settings Error",
  "Server Connection Issue"
];