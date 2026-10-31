import { COMPETITIVE_RANKS, TEAM_ROSTER_REQUIREMENTS } from "./constants.js";

export const validateBattleTag = (battletag) => {
  const regex = /^[\p{L}\p{N}]{3,12}#[0-9]{4,5}$/u;
  return regex.test(battletag);
};

export const getRankFromSR = (sr) => {
  const numericSR = parseInt(sr, 10);
  if (isNaN(numericSR)) return COMPETITIVE_RANKS[0];
  const foundRank = COMPETITIVE_RANKS.find(
    (rank) => numericSR >= rank.minSR && numericSR <= rank.maxSR
  );
  return foundRank || COMPETITIVE_RANKS[COMPETITIVE_RANKS.length - 1];
};

export const calculateTeamAverageSR = (players) => {
  if (!players || players.length === 0) return 0;
  const totalSR = players.reduce((sum, player) => sum + (parseInt(player.sr, 10) || 0), 0);
  return Math.round(totalSR / players.length);
};

export const validateTeamEligibility = (team, tournamentMaxSR) => {
  const errors = [];

  if (!team.name || team.name.trim() === "") {
    errors.push("Team name is required.");
  }

  const activePlayers = team.players ? team.players.filter(p => !p.isSubstitute) : [];
  if (activePlayers.length !== TEAM_ROSTER_REQUIREMENTS.totalActive) {
    errors.push(`Team must have exactly ${TEAM_ROSTER_REQUIREMENTS.totalActive} active players.`);
  }

  const roleCounts = { tank: 0, dps: 0, support: 0 };
  activePlayers.forEach((player) => {
    if (player.role && roleCounts[player.role] !== undefined) {
      roleCounts[player.role] += 1;
    }
    if (!validateBattleTag(player.battleTag)) {
      errors.push(`Invalid BattleTag format for ${player.name || "a player"}. Expected format: Player#1234`);
    }
    if (!player.discordTag || player.discordTag.trim() === "") {
      errors.push(`Discord username is required for ${player.name || "all players"}.`);
    }
  });

  if (roleCounts.tank !== TEAM_ROSTER_REQUIREMENTS.tank) {
    errors.push(`Team composition requires exactly ${TEAM_ROSTER_REQUIREMENTS.tank} Tank.`);
  }
  if (roleCounts.dps !== TEAM_ROSTER_REQUIREMENTS.dps) {
    errors.push(`Team composition requires exactly ${TEAM_ROSTER_REQUIREMENTS.dps} Damage players.`);
  }
  if (roleCounts.support !== TEAM_ROSTER_REQUIREMENTS.support) {
    errors.push(`Team composition requires exactly ${TEAM_ROSTER_REQUIREMENTS.support} Support players.`);
  }

  const avgSR = calculateTeamAverageSR(activePlayers);
  if (tournamentMaxSR && avgSR > tournamentMaxSR) {
    errors.push(`Team average SR (${avgSR}) exceeds tournament cap of ${tournamentMaxSR} SR.`);
  }

  return {
    isEligible: errors.length === 0,
    errors,
    averageSR: avgSR
  };
};