# Contador de Vidas

Este é um projeto simples de contador de vidas para jogadores, desenvolvido com HTML, CSS e JavaScript. O objetivo da aplicação é permitir o gerenciamento de jogadores e o controle de suas vidas, de forma que você possa adicionar, atualizar e remover jogadores conforme a necessidade.

## Funcionalidades

- **Adicionar jogadores:**  
  Permite inserir novos jogadores através de um formulário. Cada jogador é adicionado com uma contagem inicial de vidas em 0.  
  Veja a implementação no [script.js](script.js).

- **Incrementar e decrementar vidas:**  
  Cada jogador possui botões para aumentar ou diminuir sua contagem de vidas. O valor não é permitido ficar negativo.

- **Reset individual de vidas:**  
  Permite resetar a contagem de vidas de um jogador específico para 0.

- **Remover jogadores:**  
  Possibilita remover um jogador específico da lista.

- **Reset geral:**  
  Um botão para zerar as vidas de todos os jogadores.

- **Excluir todos os jogadores:**  
  Remove todos os jogadores, limpando os dados armazenados (no localStorage).

## Utilização

1. Abra o arquivo [index.html](index.html) em um navegador.
2. Utilize os botões na interface para adicionar um novo jogador, resetar as vidas ou remover os jogadores.
3. Os dados dos jogadores são salvos no localStorage, garantindo que a lista persista entre as sessões.

## Estrutura do Projeto

- **index.html:**  
  Estrutura a página principal e inclui os elementos de interface, além dos modais para adicionar jogadores.

- **script.js:**  
  Contém a lógica principal da aplicação, incluindo a classe `PlayerManager` responsável por gerenciar os jogadores e suas vidas.

- **style.css:**  
  Estiliza a página e os componentes, como os cartões de jogador e mensagens de erro.

## Tecnologias Utilizadas

- HTML5
- CSS3 (com Bootstrap 5 para o design responsivo)
- JavaScript (ES6+)
