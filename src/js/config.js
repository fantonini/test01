import { getDefaultState } from "./state.js";

const defaultConfig = {
  players: ["Joueur 1", "Joueur 2"],
  settings: {
    theme: "classique",
    sound: true,
    timer: null
  },
  startingPlayer: 0
};

export function normalizeConfig(config = {}) {
  const base = { ...defaultConfig, ...config };
  const settings = {
    ...defaultConfig.settings,
    ...config.settings,
    ...(config.theme ? { theme: config.theme } : {}),
    ...(config.sound !== undefined ? { sound: Boolean(config.sound) } : {}),
    ...(config.timer !== undefined ? { timer: config.timer } : {})
  };

  return {
    ...base,
    players: Array.isArray(base.players) && base.players.length ? [...base.players] : [...defaultConfig.players],
    settings,
    startingPlayer: typeof base.startingPlayer === "number" ? base.startingPlayer : defaultConfig.startingPlayer
  };
}

export function buildInitialState(config = {}) {
  const normalized = normalizeConfig(config);
  const defaults = getDefaultState();

  return {
    ...defaults,
    ...normalized,
    settings: normalized.settings,
    players: normalized.players,
    currentPlayerIndex: normalized.startingPlayer ?? defaults.currentPlayerIndex,
    turn: 1
  };
}

export function applySettings(store, formValues = {}) {
  const normalized = normalizeConfig({ settings: formValues });
  return store.patch({ settings: normalized.settings });
}
