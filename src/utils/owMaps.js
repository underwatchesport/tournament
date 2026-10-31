export const OVERWATCH_GAME_MODES = {
  CONTROL: "Control",
  HYBRID: "Hybrid",
  ESCORT: "Escort",
  PUSH: "Push",
  FLASHPOINT: "Flashpoint"
};

export const OVERWATCH_MAPS = [
  { id: "busan", name: "Busan", mode: OVERWATCH_GAME_MODES.CONTROL, image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop" },
  { id: "ilios", name: "Ilios", mode: OVERWATCH_GAME_MODES.CONTROL, image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop" },
  { id: "lijiang-tower", name: "Lijiang Tower", mode: OVERWATCH_GAME_MODES.CONTROL, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&auto=format&fit=crop" },
  { id: "nepal", name: "Nepal", mode: OVERWATCH_GAME_MODES.CONTROL, image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&auto=format&fit=crop" },
  { id: "oasis", name: "Oasis", mode: OVERWATCH_GAME_MODES.CONTROL, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop" },
  { id: "antarctic-peninsula", name: "Antarctic Peninsula", mode: OVERWATCH_GAME_MODES.CONTROL, image: "https://images.unsplash.com/photo-1517783999520-f068d7431a4c?w=600&auto=format&fit=crop" },

  { id: "blizzard-world", name: "Blizzard World", mode: OVERWATCH_GAME_MODES.HYBRID, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop" },
  { id: "eichenwalde", name: "Eichenwalde", mode: OVERWATCH_GAME_MODES.HYBRID, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop" },
  { id: "hollywood", name: "Hollywood", mode: OVERWATCH_GAME_MODES.HYBRID, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop" },
  { id: "kings-row", name: "King's Row", mode: OVERWATCH_GAME_MODES.HYBRID, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop" },
  { id: "midtown", name: "Midtown", mode: OVERWATCH_GAME_MODES.HYBRID, image: "https://images.unsplash.com/photo-1496868834840-5f4c98840aaa?w=600&auto=format&fit=crop" },
  { id: "paraiso", name: "Paraíso", mode: OVERWATCH_GAME_MODES.HYBRID, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&auto=format&fit=crop" },

  { id: "circuit-royal", name: "Circuit Royal", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop" },
  { id: "dorado", name: "Dorado", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&auto=format&fit=crop" },
  { id: "havana", name: "Havana", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop" },
  { id: "junkertown", name: "Junkertown", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop" },
  { id: "rialto", name: "Rialto", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop" },
  { id: "shambali-monastery", name: "Shambali Monastery", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop" },
  { id: "route-66", name: "Route 66", mode: OVERWATCH_GAME_MODES.ESCORT, image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop" },

  { id: "colosseo", name: "Colosseo", mode: OVERWATCH_GAME_MODES.PUSH, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop" },
  { id: "esperanca", name: "Esperança", mode: OVERWATCH_GAME_MODES.PUSH, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop" },
  { id: "new-queen-street", name: "New Queen Street", mode: OVERWATCH_GAME_MODES.PUSH, image: "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?w=600&auto=format&fit=crop" },
  { id: "runasapi", name: "Runasapi", mode: OVERWATCH_GAME_MODES.PUSH, image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&auto=format&fit=crop" },

  { id: "suravasa", name: "Suravasa", mode: OVERWATCH_GAME_MODES.FLASHPOINT, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop" },
  { id: "new-junk-city", name: "New Junk City", mode: OVERWATCH_GAME_MODES.FLASHPOINT, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop" }
];

export const getMapsByMode = (mode) => {
  return OVERWATCH_MAPS.filter((map) => map.mode === mode);
};