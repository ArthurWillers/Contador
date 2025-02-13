"use strict";

document.addEventListener('DOMContentLoaded', () => {
    class PlayerManager {
        constructor() {
            this.players = [];
            this.loadPlayers();
        }
    
        loadPlayers() {
            try {
                const stored = localStorage.getItem('players');
                this.players = stored ? JSON.parse(stored) : [];
            } catch (err) {
                console.error("Erro ao carregar players:", err);
                this.players = [];
            }
        }
    
        savePlayers() {
            try {
                localStorage.setItem('players', JSON.stringify(this.players));
            } catch (err) {
                console.error("Erro ao salvar players:", err);
            }
        }
    
        addPlayer(name) {
            if (this.players.some(p => p.name === name)) {
                return false;
            }
            this.players.push({ name, lives: 0 });
            this.savePlayers();
            return true;
        }
    
        updateLives(name, newLives) {
            const idx = this.players.findIndex(p => p.name === name);
            if (idx > -1) {
                this.players[idx].lives = newLives;
                this.savePlayers();
            }
        }
    
        removePlayer(name) {
            this.players = this.players.filter(p => p.name !== name);
            this.savePlayers();
        }
    
        resetAll() {
            this.players.forEach(p => p.lives = 0);
            this.savePlayers();
        }
    
        deleteAll() {
            this.players = [];
            localStorage.removeItem('players');
        }
    }
    
    // Elementos do DOM
    const playersContainer = document.getElementById('playersContainer');
    const addPlayerForm = document.getElementById('addPlayerForm');
    const playerNameInput = document.getElementById('playerName');
    const nameError = document.getElementById('nameError');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    // Instância da classe PlayerManager
    const manager = new PlayerManager();
    
    // Função de renderização
    const renderPlayers = () => {
        playersContainer.innerHTML = manager.players
            .map(({ name, lives }) => {
                return `
                <div class="col player-card border mt-2" data-player="${name}">
                  <h4>${name}</h4>
                  <div class="lives-count">${lives}</div>
                  <div class="btn-group mt-2" role="group">
                    <button class="btn btn-outline-success increment-btn"><i class="bi bi-plus"></i></button>
                    <button class="btn btn-outline-danger decrement-btn"><i class="bi bi-dash"></i></button>
                    <button class="btn btn-outline-warning reset-btn"><i class="bi bi-arrow-counterclockwise"></i></button>
                    <button class="btn btn-outline-dark remove-btn"><i class="bi bi-trash"></i></button>
                  </div>
                </div>
                `;
            })
            .join('');
    };
    
    // Delegação de eventos para os botões dentro de playersContainer
    playersContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.player-card');
        if (!card) return;
        const playerName = card.dataset.player;
        const player = manager.players.find(p => p.name === playerName);
        if (!player) return;
    
        if (e.target.closest('.increment-btn')) {
            manager.updateLives(playerName, player.lives + 1);
        } else if (e.target.closest('.decrement-btn')) {
            manager.updateLives(playerName, Math.max(player.lives - 1, 0));
        } else if (e.target.closest('.reset-btn')) {
            manager.updateLives(playerName, 0);
        } else if (e.target.closest('.remove-btn')) {
            manager.removePlayer(playerName);
        }
        renderPlayers();
    });
    
    // Eventos do formulário para adicionar jogador
    addPlayerForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = playerNameInput.value.trim();
        if (!name) return;
    
        if (!manager.addPlayer(name)) {
            nameError.textContent = `O jogador "${name}" já existe!`;
            nameError.style.display = 'block';
            playerNameInput.value = '';
            playerNameInput.focus();
            return;
        }
        nameError.style.display = 'none';
        renderPlayers();
        playerNameInput.value = '';
        bootstrap.Modal.getInstance(document.getElementById('addPlayerModal')).hide();
    });
    
    document.getElementById('addPlayerModal').addEventListener('hidden.bs.modal', () => {
        nameError.style.display = 'none';
        playerNameInput.value = '';
    });
    
    document.getElementById('addPlayerModal').addEventListener('shown.bs.modal', () => {
        playerNameInput.focus();
        playerNameInput.select();
    });
    
    // Botões de zerar e excluir todos
    resetAllBtn.addEventListener('click', () => {
        manager.resetAll();
        renderPlayers();
    });
    
    deleteAllBtn.addEventListener('click', () => {
        manager.deleteAll();
        renderPlayers();
    });
    
    // Render inicial
    renderPlayers();
});