"use strict";

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // Classe para gerenciar os jogadores e suas vidas
    class PlayerManager {
        constructor() {
            // Armazena a lista de jogadores
            this.players = [];
            // Carrega os jogadores salvos no localStorage (se houver)
            this.loadPlayers();
        }
    
        // Carrega os jogadores do localStorage
        loadPlayers() {
            try {
                // Recupera a string armazenada usando a chave 'players'
                const stored = localStorage.getItem('players');
                // Converte a string JSON em array ou inicializa um array vazio
                this.players = stored ? JSON.parse(stored) : [];
            } catch (err) {
                // Em caso de erro, exibe uma mensagem no console e reinicia a lista de jogadores
                console.error("Erro ao carregar players:", err);
                this.players = [];
            }
        }
    
        // Salva a lista atual de jogadores no localStorage
        savePlayers() {
            try {
                // Converte o array de jogadores para string JSON
                localStorage.setItem('players', JSON.stringify(this.players));
            } catch (err) {
                // Em caso de erro ao salvar, exibe mensagem no console
                console.error("Erro ao salvar players:", err);
            }
        }
    
        // Adiciona um novo jogador se o nome não existir ainda
        addPlayer(name) {
            // Verifica se já existe um jogador com o mesmo nome
            if (this.players.some(p => p.name === name)) {
                return false; // Retorna false se o jogador já existir
            }
            // Adiciona o novo jogador com vidas iniciadas em 0
            this.players.push({ name, lives: 0 });
            // Salva a nova lista de jogadores
            this.savePlayers();
            return true;
        }
    
        // Atualiza o número de vidas de um jogador existente
        updateLives(name, newLives) {
            // Procura o índice do jogador pelo nome
            const idx = this.players.findIndex(p => p.name === name);
            if (idx > -1) {
                // Atualiza as vidas e salva a lista
                this.players[idx].lives = newLives;
                this.savePlayers();
            }
        }
    
        // Remove um jogador da lista pelo nome
        removePlayer(name) {
            // Filtra a lista removendo o jogador com o nome fornecido
            this.players = this.players.filter(p => p.name !== name);
            this.savePlayers();
        }
    
        // Zera as vidas de todos os jogadores
        resetAll() {
            // Itera sobre cada jogador e define vidas para 0
            this.players.forEach(p => p.lives = 0);
            this.savePlayers();
        }
    
        // Remove todos os jogadores e limpa o localStorage
        deleteAll() {
            this.players = [];
            localStorage.removeItem('players');
        }
    }
    
    // Seleciona elementos do DOM
    const playersContainer = document.getElementById('playersContainer');
    const addPlayerForm = document.getElementById('addPlayerForm');
    const playerNameInput = document.getElementById('playerName');
    const nameError = document.getElementById('nameError');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    // Cria uma instância do gerenciador de jogadores
    const manager = new PlayerManager();
    
    // Função que renderiza a lista de jogadores na interface
    const renderPlayers = () => {
        // Mapeia os jogadores para criar o HTML de cada cartão
        playersContainer.innerHTML = manager.players
            .map(({ name, lives }) => {
                return `
                <div class="col player-card border mt-2" data-player="${name}">
                  <h4>${name}</h4>
                  <div class="lives-count">${lives}</div>
                  <div class="btn-group mt-2" role="group">
                    <!-- Botão para incrementar vidas -->
                    <button class="btn btn-outline-success increment-btn"><i class="bi bi-plus"></i></button>
                    <!-- Botão para decrementar vidas -->
                    <button class="btn btn-outline-danger decrement-btn"><i class="bi bi-dash"></i></button>
                    <!-- Botão para resetar vidas -->
                    <button class="btn btn-outline-warning reset-btn"><i class="bi bi-arrow-counterclockwise"></i></button>
                    <!-- Botão para remover jogador -->
                    <button class="btn btn-outline-dark remove-btn"><i class="bi bi-trash"></i></button>
                  </div>
                </div>
                `;
            })
            .join('');
    };
    
    // Usa delegação de eventos para detectar cliques nos botões dos cartões dos jogadores
    playersContainer.addEventListener('click', (e) => {
        // Localiza o cartão do jogador a partir do evento de clique
        const card = e.target.closest('.player-card');
        if (!card) return;
        // Recupera o nome do jogador a partir do atributo data-player
        const playerName = card.dataset.player;
        // Procura o objeto jogador correspondente na lista
        const player = manager.players.find(p => p.name === playerName);
        if (!player) return;
    
        // Verifica qual botão foi clicado e executa a ação correspondente
        if (e.target.closest('.increment-btn')) {
            // Incrementa a contagem de vidas
            manager.updateLives(playerName, player.lives + 1);
        } else if (e.target.closest('.decrement-btn')) {
            // Decrementa a contagem de vidas, garantindo que não seja negativo
            manager.updateLives(playerName, Math.max(player.lives - 1, 0));
        } else if (e.target.closest('.reset-btn')) {
            // Reseta as vidas para zero
            manager.updateLives(playerName, 0);
        } else if (e.target.closest('.remove-btn')) {
            // Remove o jogador da lista
            manager.removePlayer(playerName);
        }
        // Atualiza a renderização da interface
        renderPlayers();
    });
    
    // Evento do formulário para adicionar novo jogador
    addPlayerForm.addEventListener('submit', e => {
        // Previne o comportamento padrão de envio do formulário
        e.preventDefault();
        const name = playerNameInput.value.trim();
        if (!name) return;
    
        // Tenta adicionar o jogador e, se falhar, exibe mensagem de erro
        if (!manager.addPlayer(name)) {
            nameError.textContent = `O contador "${name}" já existe!`;
            nameError.style.display = 'block';
            playerNameInput.value = '';
            playerNameInput.focus();
            return;
        }
        // Esconde a mensagem de erro e atualiza a renderização
        nameError.style.display = 'none';
        renderPlayers();
        // Limpa o input e fecha o modal de adição
        playerNameInput.value = '';
        bootstrap.Modal.getInstance(document.getElementById('addPlayerModal')).hide();
    });
    
    // Limpa os campos e mensagens quando o modal é fechado
    document.getElementById('addPlayerModal').addEventListener('hidden.bs.modal', () => {
        nameError.style.display = 'none';
        playerNameInput.value = '';
    });
    
    // Foca o input e seleciona o texto ao exibir o modal
    document.getElementById('addPlayerModal').addEventListener('shown.bs.modal', () => {
        playerNameInput.focus();
        playerNameInput.select();
    });
    
    // Botão para resetar as vidas de todos os jogadores
    resetAllBtn.addEventListener('click', () => {
        manager.resetAll();
        renderPlayers();
    });
    
    // Botão para excluir todos os jogadores
    deleteAllBtn.addEventListener('click', () => {
        manager.deleteAll();
        renderPlayers();
    });
    
    // Renderização inicial da lista de jogadores
    renderPlayers();
});