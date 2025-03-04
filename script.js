"use strict";

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // Classe para gerenciar os contadores
    class CounterManager {
        constructor() {
            // Armazena a lista de contadores
            this.counters = [];
            // Carrega os contadores salvos no localStorage (se houver)
            this.loadCounters();
        }

        // Carrega os contadores do localStorage
        loadCounters() {
            try {
                // Recupera a string armazenada usando a chave 'counters'
                const stored = localStorage.getItem('counters');
                // Converte a string JSON em array ou inicializa um array vazio
                this.counters = stored ? JSON.parse(stored) : [];
            } catch (err) {
                // Em caso de erro, exibe uma mensagem no console e reinicia a lista de contadores
                console.error("Erro ao carregar contadores:", err);
                this.counters = [];
            }
        }

        // Salva a lista atual de contadores no localStorage
        saveCounters() {
            try {
                // Converte o array de contadores para string JSON
                localStorage.setItem('counters', JSON.stringify(this.counters));
            } catch (err) {
                // Em caso de erro ao salvar, exibe mensagem no console
                console.error("Erro ao salvar contadores:", err);
            }
        }

        // Adiciona um novo contador se o nome não existir ainda
        addCounter(name) {
            // Verifica se já existe um contador com o mesmo nome
            if (this.counters.some(c => c.name === name)) {
                return false; // Retorna false se o contador já existir
            }
            // Adiciona o novo contador com contagem iniciada em 0
            this.counters.push({ name, count: 0 });
            // Salva a nova lista de contadores
            this.saveCounters();
            return true;
        }

        // Atualiza o número de contagem de um contador existente
        updateCount(name, newCount) {
            // Procura o índice do contador pelo nome
            const idx = this.counters.findIndex(c => c.name === name);
            if (idx > -1) {
                // Atualiza a contagem e salva a lista
                this.counters[idx].count = newCount;
                this.saveCounters();
            }
        }

        // Remove um contador da lista pelo nome
        removeCounter(name) {
            // Filtra a lista removendo o contador com o nome fornecido
            this.counters = this.counters.filter(c => c.name !== name);
            this.saveCounters();
        }

        // Zera a contagem de todos os contadores
        resetAll() {
            // Itera sobre cada contador e define contagem para 0
            this.counters.forEach(c => c.count = 0);
            this.saveCounters();
        }

        // Remove todos os contadores e limpa o localStorage
        deleteAll() {
            this.counters = [];
            localStorage.removeItem('counters');
        }
    }

    // Seleciona elementos do DOM
    const countersContainer = document.getElementById('countersContainer');
    const addCounterForm = document.getElementById('addCounterForm');
    const counterNameInput = document.getElementById('counterName');
    const counterError = document.getElementById('counterError');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    // Cria uma instância do gerenciador de contadores
    const manager = new CounterManager();

    // Função que renderiza a lista de contadores na interface
    const renderCounters = () => {
        // Mapeia os contadores para criar o HTML de cada cartão
        countersContainer.innerHTML = manager.counters
            .map(({ name, count }) => {
                return `
                <div class="col counter-card border mt-2" data-counter="${name}">
                  <h4>${name}</h4>
                  <div class="lives-count">${count}</div>
                  <div class="btn-group mt-2" role="group">
                    <!-- Botão para incrementar contagem -->
                    <button class="btn btn-outline-success increment-btn"><i class="bi bi-plus"></i></button>
                    <!-- Botão para decrementar contagem -->
                    <button class="btn btn-outline-danger decrement-btn"><i class="bi bi-dash"></i></button>
                    <!-- Botão para resetar contagem -->
                    <button class="btn btn-outline-warning reset-btn"><i class="bi bi-arrow-counterclockwise"></i></button>
                    <!-- Botão para remover contador -->
                    <button class="btn btn-outline-dark remove-btn"><i class="bi bi-trash"></i></button>
                  </div>
                </div>
                `;
            })
            .join('');
    };

    // Usa delegação de eventos para detectar cliques nos botões dos cartões dos contadores
    countersContainer.addEventListener('click', (e) => {
        // Localiza o cartão do contador a partir do evento de clique
        const card = e.target.closest('.counter-card');
        if (!card) return;
        // Recupera o nome do contador a partir do atributo data-counter
        const counterName = card.dataset.counter;
        // Procura o objeto contador correspondente na lista
        const counterObj = manager.counters.find(c => c.name === counterName);
        if (!counterObj) return;

        // Verifica qual botão foi clicado e executa a ação correspondente
        if (e.target.closest('.increment-btn')) {
            // Incrementa a contagem
            manager.updateCount(counterName, counterObj.count + 1);
        } else if (e.target.closest('.decrement-btn')) {
            // Decrementa a contagem, garantindo que não seja negativa
            manager.updateCount(counterName, Math.max(counterObj.count - 1, 0));
        } else if (e.target.closest('.reset-btn')) {
            // Reseta a contagem para zero
            manager.updateCount(counterName, 0);
        } else if (e.target.closest('.remove-btn')) {
            // Remove o contador da lista
            manager.removeCounter(counterName);
        }
        // Atualiza a renderização da interface
        renderCounters();
    });

    // Evento do formulário para adicionar novo contador
    addCounterForm.addEventListener('submit', e => {
        // Previne o comportamento padrão de envio do formulário
        e.preventDefault();
        const name = counterNameInput.value.trim();
        if (!name) return;

        // Tenta adicionar o contador e, se falhar, exibe mensagem de erro
        if (!manager.addCounter(name)) {
            counterError.textContent = `O contador "${name}" já existe!`;
            counterError.style.display = 'block';
            counterNameInput.value = '';
            counterNameInput.focus();
            return;
        }
        // Esconde a mensagem de erro e atualiza a renderização
        counterError.style.display = 'none';
        renderCounters();
        // Limpa o input e fecha o modal de adição
        counterNameInput.value = '';
        bootstrap.Modal.getInstance(document.getElementById('addCounterModal')).hide();
    });

    // Limpa os campos e mensagens quando o modal é fechado
    document.getElementById('addCounterModal').addEventListener('hidden.bs.modal', () => {
        counterError.style.display = 'none';
        counterNameInput.value = '';
    });

    // Foca o input e seleciona o texto ao exibir o modal
    document.getElementById('addCounterModal').addEventListener('shown.bs.modal', () => {
        counterNameInput.focus();
        counterNameInput.select();
    });

    // Botão para resetar a contagem de todos os contadores
    resetAllBtn.addEventListener('click', () => {
        manager.resetAll();
        renderCounters();
    });

    // Botão para excluir todos os contadores
    deleteAllBtn.addEventListener('click', () => {
        manager.deleteAll();
        renderCounters();
    });

    // Renderização inicial da lista de contadores
    renderCounters();
});