import { readable, writable, get } from "svelte/store";

const initialBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
// Obligée de faire ça car impossible de remettre le plateau a 0 sinno
export const board = writable(JSON.parse(JSON.stringify(initialBoard)));
export const disabledBoard = writable(false)

const winningCombinaisons = [
    [{row: 0, cell: 0}, {row: 0, cell: 1}, {row: 0, cell: 2}],
    [{row: 1, cell: 0}, {row: 1, cell: 1}, {row: 1, cell: 2}],
    [{row: 2, cell: 0}, {row: 2, cell: 1}, {row: 2, cell: 2}],
    [{row: 0, cell: 0}, {row: 1, cell: 0}, {row: 2, cell: 0}],
    [{row: 0, cell: 1}, {row: 1, cell: 1}, {row: 2, cell: 1}],
    [{row: 0, cell: 2}, {row: 1, cell: 2}, {row: 2, cell: 2}],
    [{row: 0, cell: 0}, {row: 1, cell: 1}, {row: 2, cell: 2}],
    [{row: 0, cell: 2}, {row: 1, cell: 1}, {row: 2, cell: 0}],
]

// PLAYERS ---------------------------------------------

export const players = writable([
  {
    name: "Joueur 1",
    symbol: "❌",
    score:0
  },
  {
    name: "Joueur 2",
    symbol: "⭕",
    score:0
  },
]);
export const currentPlayer = writable(0);

export function switchPlayer() {
  currentPlayer.update(currentPlayer => (currentPlayer + 1) % 2);
  // Le modulo est utilisé pour s'assurer que la valeur reste dans les limites de 0 et 1 et boucler dessus
}

// PLAYERS ---------------------------------------------


// BOARD   ---------------------------------------------

const ticTacToeRules = () => {
  return {
    subscribe: board.subscribe,
    nextmove: (row, cell) => board.update((board) => updateBoard(board, row, cell)),
    resetBoard: () => {
      board.set(JSON.parse(JSON.stringify(initialBoard)));
      currentPlayer.set(0);
      disabledBoard.update((value) => {return false})
    }
  };
};

function updateBoard(board, row, cell) {
    const currentPlayerValue = get(currentPlayer);
    const playersValue = get(players);

    if (board[row][cell] === "") {
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[row][cell] = playersValue[currentPlayerValue].symbol;
        verifyWinner(newBoard);
        return newBoard;
    } else {
        console.log(`Tu triches batard`);
        return board;
    }
}

function verifyWinner(currentBoard) {
    let winner = null;
    const currentPlayerValue = get(currentPlayer);
    const playersValue = get(players);

    winningCombinaisons.forEach(combination => {
        const [a, b, c] = combination;
        const value = currentBoard[a.row][a.cell];

        if (
            value &&
            value === currentBoard[b.row][b.cell] &&
            value === currentBoard[c.row][c.cell]
        ) {
            players.update((self) => {
                self[currentPlayerValue].score += 1;
                return self;
            });

            winner = playersValue[currentPlayerValue].name;
        }
    });

    if (winner) {
       winnerOverlay()
    } else if (currentBoard.every(row => row.every(cell => cell !== ""))) {
        console.log("Match nul");
        setTimeout(() => ticTacToe.resetBoard(), 100);
    } else {
        switchPlayer();
    }
}

function winnerOverlay(){
    disabledBoard.update((value) => {return true})
    
}
export const ticTacToe = ticTacToeRules();

// BOARD   ---------------------------------------------