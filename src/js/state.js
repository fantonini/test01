const defaultState = {
  players: ["Joueur 1", "Joueur 2"],
  currentPlayerIndex: 0,
  turn: 1,
  settings: {
    theme: "classique",
    sound: true,
    timer: null
  }
};

function mergeState(overrides = {}) {
  const players = overrides.players?.length ? [...overrides.players] : [...defaultState.players];
  const settings = {
    ...defaultState.settings,
    ...(overrides.settings || {})
  };

  const mergedState = {
    ...defaultState,
    ...overrides,
    players,
    settings
  };

  if (typeof overrides.startingPlayer === "number") {
    mergedState.currentPlayerIndex = Math.max(0, Math.min(overrides.startingPlayer, players.length - 1));
  }

  return mergedState;
}

export function createStore(initialState = {}) {
  let state = mergeState(initialState);
  const listeners = new Set();

  const notify = () => listeners.forEach((callback) => callback(getState()));
  const getState = () => ({ ...state, players: [...state.players], settings: { ...state.settings } });

  return {
    getState,
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    patch(partialState = {}) {
      state = mergeState({ ...state, ...partialState });
      notify();
      return getState();
    },
    reset(nextState = {}) {
      state = mergeState(nextState);
      notify();
      return getState();
    }
  };
}

export function getDefaultState() {
  return mergeState();
}
