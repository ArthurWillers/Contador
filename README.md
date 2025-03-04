# Contador Geral

Este é um projeto simples de contador para diversas finalidades, desenvolvido com HTML, CSS e JavaScript. O objetivo da aplicação é permitir o gerenciamento de múltiplos itens e o controle de suas contagens, de forma que você possa adicionar, atualizar e remover itens conforme a necessidade.

## Funcionalidades

- **Adicionar itens:**  
  Permite inserir novos itens através de um formulário. Cada item é adicionado com uma contagem inicial em 0.  
  Veja a implementação no [script.js](script.js).

- **Incrementar e decrementar contagens:**  
  Cada item possui botões para aumentar ou diminuir sua contagem. O valor não é permitido ficar negativo.

- **Reset individual de contagens:**  
  Permite resetar a contagem de um item específico para 0.

- **Remover itens:**  
  Possibilita remover um item específico da lista.

- **Reset geral:**  
  Um botão para zerar as contagens de todos os itens.

- **Excluir todos os itens:**  
  Remove todos os itens, limpando os dados armazenados (no localStorage).

## Utilização

1. Abra o arquivo [index.html](index.html) em um navegador.
2. Utilize os botões na interface para adicionar um novo item, resetar as contagens ou remover os itens.
3. Os dados dos itens são salvos no localStorage, garantindo que a lista persista entre as sessões.

## Estrutura do Projeto

- **index.html:**  
  Estrutura a página principal e inclui os elementos de interface, além dos modais para adicionar itens.

- **script.js:**  
  Contém a lógica principal da aplicação, incluindo a classe `PlayerManager` (ou gerenciador de itens) responsável por gerenciar as contagens.

- **style.css:**  
  Estiliza a página e os componentes, como os cartões e mensagens de erro.

## Tecnologias Utilizadas

- HTML5
- CSS3 (com Bootstrap 5 para o design responsivo)
- JavaScript (ES6+)
