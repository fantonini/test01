import { createStore } from "./state.js";
import { applySettings as applySettingsToStore, buildInitialState, normalizeConfig } from "./config.js";
import { advanceTurn, currentPlayer } from "./turns.js";

const store = createStore();

export function initGame(config = {}) {
  const initialState = buildInitialState(normalizeConfig(config));
  return store.reset(initialState);
}

export function resetGame() {
  return store.reset();
}

export function applySettings(formValues = {}) {
  return applySettingsToStore(store, formValues);
}

export function nextTurn() {
  return advanceTurn(store);
}

export function getCurrentPlayer() {
  return currentPlayer(store);
}

function updateUI() {
  const state = store.getState();
  const app = document.getElementById("app");
  const playerElement = document.getElementById("player");
  const turnElement = document.getElementById("turn");
  const themeBadge = document.getElementById("theme");
  const soundBadge = document.getElementById("sound");
  const timerBadge = document.getElementById("timer");

  if (app) {
    if (state.settings.theme === "clair") {
      app.dataset.theme = "clair";
    } else {
      app.dataset.theme = "sombre";
    }
  }

  if (playerElement) playerElement.textContent = getCurrentPlayer();
  if (turnElement) turnElement.textContent = state.turn;
  if (themeBadge) themeBadge.textContent = state.settings.theme;
  if (soundBadge) soundBadge.textContent = state.settings.sound ? "Activé" : "Coupé";
  if (timerBadge) timerBadge.textContent = state.settings.timer ?? "Off";
}

function wireControls() {
  const form = document.getElementById("settings-form");
  const nextTurnButton = document.getElementById("next-turn");
  const resetButton = document.getElementById("reset");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      applySettings({
        theme: formData.get("theme"),
        sound: formData.get("sound") === "on",
        timer: formData.get("timer") || null
      });
    });
  }

  if (nextTurnButton) {
    nextTurnButton.addEventListener("click", () => nextTurn());
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => resetGame());
  }
}

function bootstrap() {
  wireControls();
  store.subscribe(updateUI);
  initGame();
  updateUI();
}

document.addEventListener("DOMContentLoaded", bootstrap);
