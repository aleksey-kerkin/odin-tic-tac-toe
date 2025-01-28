const GameBoard = (() => {
  // Private state
  let board = Array(9).fill(null);

  // Public methods
  return {
    getBoard: () => [...board],
    placeMarker: (index, marker) => {
      if (index < 0 || index > 8 || board[index] !== null) return false;
      board[index] = marker;
      return true;
    },
    resetBoard: () => {
      board.fill(null);
    },
  };
})();

const Player = (name, marker) => {
  return { getName: () => name, getMarker: () => marker };
};

const GameController = (() => {
  // Private state
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  // Public methods
  return {
    startNewGame(player1Name, player2Name) {
      players = [Player(player1Name, "X"), Player(player2Name, "O")];
      currentPlayerIndex = 0;
      gameOver = false;
      GameBoard.resetBoard();
    },

    getCurrentPlayer() {
      return players[currentPlayerIndex];
    },

    handleTurn(index) {
      if (gameOver) return;

      const success = GameBoard.placeMarker(
        index,
        this.getCurrentPlayer().getMarker()
      );

      if (success) {
        console.log(`
          Player ${this.getCurrentPlayer().getName()} 
          placed marker: ${this.getCurrentPlayer().getMarker()}
        `);
        gameOver = this.checkGameOver();
        if (!gameOver) currentPlayerIndex = 1 - currentPlayerIndex;
      }
      if (gameOver) {
        if (gameOver === "draw") {
          console.log("It's a draw!");
        } else {
          console.log(`Player ${this.getCurrentPlayer().getName()} wins!`);
        }
      }
    },

    checkGameOver() {
      const winningCombos = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6],
      ];

      const board = GameBoard.getBoard();

      // Check for win
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return true; // Win detected
        }
      }
      // Check for draw
      if (!board.includes(null)) return "draw";

      return false; // Game continues
    },
  };
})();
