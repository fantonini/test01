export function currentPlayer(store) {
  const state = store.getState();
  return state.players[state.currentPlayerIndex] || "";
}

export function advanceTurn(store) {
  const state = store.getState();
  const playerCount = state.players.length;

  if (!playerCount) {
    return state;
  }

  const nextIndex = (state.currentPlayerIndex + 1) % playerCount;
  return store.patch({
    currentPlayerIndex: nextIndex,
    turn: state.turn + 1
  });
}

export function setCurrentPlayer(store, playerIndex = 0) {
  const state = store.getState();
  const clampedIndex = Math.max(0, Math.min(playerIndex, state.players.length - 1));
  return store.patch({ currentPlayerIndex: clampedIndex });
}
