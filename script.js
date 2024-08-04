document.addEventListener('DOMContentLoaded', () => {
  const playersContainer = document.getElementById('playersContainer');
  const addPlayerForm = document.getElementById('addPlayerForm');
  const playerNameInput = document.getElementById('playerName');
  const nameError = document.getElementById('nameError');
  const resetAllBtn = document.getElementById('resetAllBtn');
  const deleteAllBtn = document.getElementById('deleteAllBtn');
  let undoTimeout;
  const undoContainer = document.createElement('div');

  // Load players from localStorage
  const loadPlayers = () => {
      playersContainer.innerHTML = '';
      const players = JSON.parse(localStorage.getItem('players')) || [];
      players.forEach(player => createPlayerCard(player.name, player.lives));
  };

  // Save players to localStorage
  const savePlayers = players => {
      localStorage.setItem('players', JSON.stringify(players));
  };

  // Create player card
  const createPlayerCard = (name, lives) => {
      const playerCard = document.createElement('div');
      playerCard.className = 'col player-card border mt-2';
      playerCard.innerHTML = `
          <h4>${name}</h4>
          <div class="lives-count">${lives}</div>
          <div class="btn-group mt-2" role="group">
              <button class="btn btn-outline-success increment-btn"><i class="bi bi-plus"></i></button>
              <button class="btn btn-outline-danger decrement-btn"><i class="bi bi-dash"></i></button>
              <button class="btn btn-outline-warning reset-btn"><i class="bi bi-arrow-counterclockwise"></i></button>
              <button class="btn btn-outline-dark remove-btn"><i class="bi bi-trash"></i></button>
          </div>
      `;
      playersContainer.appendChild(playerCard);

      // Add event listeners for the buttons
      const incrementBtn = playerCard.querySelector('.increment-btn');
      const decrementBtn = playerCard.querySelector('.decrement-btn');
      const resetBtn = playerCard.querySelector('.reset-btn');
      const removeBtn = playerCard.querySelector('.remove-btn');
      const livesCount = playerCard.querySelector('.lives-count');

      incrementBtn.addEventListener('click', () => {
          let lives = parseInt(livesCount.textContent);
          livesCount.textContent = ++lives;
          updatePlayer(name, lives);
      });

      decrementBtn.addEventListener('click', () => {
          let lives = parseInt(livesCount.textContent);
          if (lives > 0) {
              livesCount.textContent = --lives;
              updatePlayer(name, lives);
          }
      });

      resetBtn.addEventListener('click', () => {
          livesCount.textContent = 0;
          updatePlayer(name, 0);
      });

      removeBtn.addEventListener('click', () => {
          playersContainer.removeChild(playerCard);
          removePlayer(name);
      });
  };

  // Add player
  addPlayerForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = playerNameInput.value.trim();
      if (name === '') return;

      const players = JSON.parse(localStorage.getItem('players')) || [];
      if (players.find(player => player.name === name)) {
          nameError.style.display = 'block';
          return;
      }
      nameError.style.display = 'none';

      players.push({ name, lives: 0 });
      savePlayers(players);
      createPlayerCard(name, 0);

      playerNameInput.value = '';
      bootstrap.Modal.getInstance(document.getElementById('addPlayerModal')).hide();
  });

  // Update player lives
  const updatePlayer = (name, lives) => {
      const players = JSON.parse(localStorage.getItem('players')) || [];
      const playerIndex = players.findIndex(player => player.name === name);
      if (playerIndex !== -1) {
          players[playerIndex].lives = lives;
          savePlayers(players);
      }
  };

  // Remove player
  const removePlayer = name => {
      let players = JSON.parse(localStorage.getItem('players')) || [];
      players = players.filter(player => player.name !== name);
      savePlayers(players);
      showUndoButton(() => {
          savePlayers(players);
          loadPlayers();
      });
  };

  // Reset all players
  resetAllBtn.addEventListener('click', () => {
      const players = JSON.parse(localStorage.getItem('players')) || [];
      players.forEach(player => player.lives = 0);
      savePlayers(players);
      loadPlayers();
  });

  // Delete all players
  deleteAllBtn.addEventListener('click', () => {
      localStorage.removeItem('players');
      playersContainer.innerHTML = '';
      showUndoButton(() => {
          localStorage.removeItem('players');
          loadPlayers();
      });
  });

  // Initial load
  loadPlayers();
});
