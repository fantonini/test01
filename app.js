const icons = [
  { symbol: "🐱", label: "Chat" },
  { symbol: "🐶", label: "Chien" },
  { symbol: "🦊", label: "Renard" },
  { symbol: "🐸", label: "Grenouille" },
  { symbol: "🐼", label: "Panda" },
  { symbol: "🐯", label: "Tigre" },
  { symbol: "🦉", label: "Hibou" },
  { symbol: "🐙", label: "Poulpe" },
  { symbol: "🐢", label: "Tortue" },
  { symbol: "🦁", label: "Lion" },
  { symbol: "🐵", label: "Singe" },
  { symbol: "🦄", label: "Licorne" },
];

class MemoryGame {
  constructor({ pairCount, players, elements }) {
    this.pairCount = pairCount;
    this.players = players;
    this.elements = elements;
    this.turn = 0;
    this.revealed = [];
    this.deck = [];
    this.blocked = false;
  }

  init() {
    this.resetScores();
    this.prepareDeck();
    this.renderPlayers();
    this.renderBoard();
    this.updateCurrentPlayer();
  }

  resetScores() {
    this.players = this.players.map((player) => ({ ...player, score: 0 }));
  }

  prepareDeck() {
    const selected = icons.slice(0, this.pairCount);
    const pairs = selected.flatMap((icon) => [
      { ...icon, id: crypto.randomUUID() },
      { ...icon, id: crypto.randomUUID() },
    ]);
    this.deck = this.shuffle(pairs);
  }

  shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  renderPlayers() {
    const { playersList } = this.elements;
    playersList.innerHTML = "";
    this.players.forEach((player, index) => {
      const item = document.createElement("li");
      item.className = "player";
      item.dataset.index = index;
      item.innerHTML = `
        <span>${player.name}</span>
        <strong>${player.score}</strong>
      `;
      playersList.appendChild(item);
    });
  }

  renderBoard() {
    const { gameGrid } = this.elements;
    gameGrid.innerHTML = "";
    this.deck.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.dataset.cardId = card.id;
      cardEl.dataset.symbol = card.symbol;
      cardEl.dataset.label = card.label;

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Carte ${index + 1}: ${card.label}`);
      button.appendChild(this.buildCardFaces(card));
      button.addEventListener("click", () => this.handleCardClick(cardEl));

      cardEl.appendChild(button);
      gameGrid.appendChild(cardEl);
    });
  }

  buildCardFaces(card) {
    const wrapper = document.createElement("div");
    wrapper.className = "card-inner";

    const back = document.createElement("div");
    back.className = "card-face card-face--back";
    back.textContent = "?";

    const front = document.createElement("div");
    front.className = "card-face card-face--front";
    front.innerHTML = `
      <div>${card.symbol}</div>
      <div class="card-label">${card.label}</div>
    `;

    wrapper.append(back, front);
    return wrapper;
  }

  handleCardClick(cardEl) {
    if (this.blocked) return;

    const alreadyFlipped = cardEl.classList.contains("is-flipped") || cardEl.classList.contains("is-matched");
    if (alreadyFlipped && cardEl.dataset.symbol) {
      this.showOverlay(cardEl.dataset.symbol, cardEl.dataset.label);
      return;
    }

    cardEl.classList.add("is-flipped");
    this.revealed.push(cardEl);

    if (this.revealed.length === 2) {
      this.blocked = true;
      const [first, second] = this.revealed;
      const isMatch = first.dataset.symbol === second.dataset.symbol;

      if (isMatch) {
        this.markAsMatched(first, second);
        this.incrementScore();
        this.showOverlay(first.dataset.symbol, first.dataset.label);
        this.resetTurn();
      } else {
        setTimeout(() => {
          first.classList.remove("is-flipped");
          second.classList.remove("is-flipped");
          this.switchPlayer();
          this.resetTurn();
        }, 800);
      }
    }
  }

  markAsMatched(...cards) {
    cards.forEach((card) => card.classList.add("is-matched"));
  }

  incrementScore() {
    this.players[this.turn].score += 1;
    this.updateScores();
  }

  switchPlayer() {
    this.turn = (this.turn + 1) % this.players.length;
    this.updateCurrentPlayer();
  }

  resetTurn() {
    this.revealed = [];
    this.blocked = false;
  }

  updateCurrentPlayer() {
    this.elements.currentPlayer.textContent = this.players[this.turn].name;
  }

  updateScores() {
    this.players.forEach((player, index) => {
      const item = this.elements.playersList.querySelector(`[data-index="${index}"] strong`);
      if (item) item.textContent = player.score;
    });
  }

  showOverlay(symbol, label) {
    this.elements.overlayVisual.textContent = symbol;
    this.elements.overlayLabel.textContent = label;
    this.elements.overlay.hidden = false;
  }

  hideOverlay() {
    this.elements.overlay.hidden = true;
  }
}

function init() {
  const elements = {
    gameGrid: document.getElementById("game"),
    playersList: document.getElementById("players"),
    currentPlayer: document.getElementById("currentPlayer"),
    pairCount: document.getElementById("pairCount"),
    applySettings: document.getElementById("applySettings"),
    overlay: document.getElementById("overlay"),
    overlayVisual: document.getElementById("overlayVisual"),
    overlayLabel: document.getElementById("overlayLabel"),
    overlayClose: document.querySelector(".overlay__close"),
  };

  const game = new MemoryGame({
    pairCount: Number(elements.pairCount.value),
    players: [
      { name: "Joueur 1", score: 0 },
      { name: "Joueur 2", score: 0 },
    ],
    elements,
  });

  function applySettings() {
    const count = Math.min(Math.max(Number(elements.pairCount.value) || 2, 2), icons.length);
    game.pairCount = count;
    game.turn = 0;
    game.init();
  }

  elements.applySettings.addEventListener("click", applySettings);
  elements.overlay.addEventListener("click", (event) => {
    if (event.target === elements.overlay || event.target === elements.overlayClose) {
      game.hideOverlay();
    }
  });

  applySettings();
}

window.addEventListener("DOMContentLoaded", init);
