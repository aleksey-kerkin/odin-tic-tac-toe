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
  let winningCombo = null;

  // Public methods
  return {
    startNewGame(player1Name, player2Name) {
      players = [Player(player1Name, "X"), Player(player2Name, "O")];
      currentPlayerIndex = 0;
      gameOver = false;
      winningCombo = null; // Reset winning combo
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
        gameOver = this.checkGameOver();
        if (!gameOver) currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.render();
      }
    },

    checkGameOver() {
      winningCombo = null;
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
          winningCombo = combo; // Store winning indexes
          return true; // Return boolean for win
        }
      }

      // Check for draw
      if (!board.includes(null)) return "draw";
      return false;
    },
    getPlayers: () => players,
    getWinningCombo: () => winningCombo,
  };
})();

const DisplayController = (() => {
  const boardElement = document.querySelector(".gameboard");
  const statusElement = document.querySelector(".status");

  const render = () => {
    const board = GameBoard.getBoard();
    const currentPlayer = GameController.getCurrentPlayer();
    const gameOver = GameController.checkGameOver();
    const winningCombo = GameController.getWinningCombo();

    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
      const cellButton = document.createElement("button");
      cellButton.setAttribute(
        "aria-label",
        cell
          ? `${cell} marker at position ${index + 1}`
          : `Empty cell ${index + 1}`
      );
      cellButton.setAttribute("role", "gridcell");
      cellButton.setAttribute("tabindex", "0"); // Make focusable
      cellButton.setAttribute("aria-disabled", cell !== null);
      cellButton.classList.add("gameboard--cell", "button");
      cellButton.textContent = cell || "";
      if (cell === "X") {
        cellButton.classList.add("color--pink");
      } else if (cell === "O") {
        cellButton.classList.add("color--green");
      }
      cellButton.addEventListener("click", () => {
        GameController.handleTurn(index);
        render(); // re-render each move
      });
      boardElement.appendChild(cellButton);
      if (gameOver && winningCombo?.includes(index)) {
        cellButton.classList.add("winner--cell");
      }
      cellButton.disabled = gameOver || cell !== null;
    });
    if (gameOver === true) {
      statusElement.textContent = `${currentPlayer.getName()} wins!`;
    } else if (gameOver === "draw") {
      statusElement.textContent = "It's a draw!";
    } else {
      statusElement.textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMarker()})`;
    }
  };

  return { render };
})();

document.querySelector(".button--start").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission
  const player1 = document.getElementById("player1").value || "Player 1";
  const player2 = document.getElementById("player2").value || "Player 2";
  GameController.startNewGame(player1, player2);
  DisplayController.render();
});

document.querySelector(".button--restart").addEventListener("click", () => {
  const currentPlayers = GameController.getPlayers();
  GameController.startNewGame(
    currentPlayers[0].getName(),
    currentPlayers[1].getName()
  );
  DisplayController.render(); // Force immediate re-render
});
