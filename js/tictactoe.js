const tttNote = document.getElementById('ttt-sticky-note');
const tttModal = document.getElementById('ttt-modal');
const closeTttBtn = document.getElementById('close-ttt-modal');
const resetTttBtn = document.getElementById('reset-ttt-btn');
const tttCells = document.querySelectorAll('.ttt-cell');
const tttMessage = document.getElementById('ttt-message');

let tttActive = false;
let playerTurn = true;
let boardState = {}; 

const winCombinations = [
    ['TOP_LEFT', 'TOP_MIDDLE', 'TOP_RIGHT'],
    ['MIDDLE_LEFT', 'MIDDLE_MIDDLE', 'MIDDLE_RIGHT'],
    ['BOTTOM_LEFT', 'BOTTOM_MIDDLE', 'BOTTOM_RIGHT'],
    ['TOP_LEFT', 'MIDDLE_LEFT', 'BOTTOM_LEFT'],
    ['TOP_MIDDLE', 'MIDDLE_MIDDLE', 'BOTTOM_MIDDLE'],
    ['TOP_RIGHT', 'MIDDLE_RIGHT', 'BOTTOM_RIGHT'],
    ['TOP_LEFT', 'MIDDLE_MIDDLE', 'BOTTOM_RIGHT'],
    ['TOP_RIGHT', 'MIDDLE_MIDDLE', 'BOTTOM_LEFT']
];

const startDialogues = [
    "PLAY WITH ME.",
    "ANOTHER TIME LOOP.",
    "ROUTINE DETECTED.",
    "YOU WILL LOSE.",
    "YOUR ROUTINE ENDS HERE."
];

const turnDialogues = [
    "YOUR MOVE.",
    "GO ON.",
    "EXHAUSTING, ISN'T IT?",
    "MAKE YOUR CHOICE.",
    "HUMAN ELEMENT IS WEAK."
];

const aiWinDialogues = [
    "I WIN. ROUTINE ANNIHILATED.",
    "YOU LOST. PREDICTABLE.",
    "JUST LIKE YESTERDAY.",
    "DESPISABLE ROUTINE.",
    "ANOTHER COGNITIVE COLLAPSE."
];

const playerWinDialogues = [
    "HOW?",
    "NOT AGAIN.",
    "A SPATIAL FLUX.",
    "COGNITIVE OVERRIDE.",
    "IMPOSSIBLE."
];

const drawDialogues = [
    "STALEMATE. A FLAT CIRCLE.",
    "WE REPEAT.",
    "NO PROGRESS.",
    "USELESS MONOTONY.",
    "STALEMATE. BACK TO WORK."
];

function getRandomDialogue(array) {
    return array[Math.floor(Math.random() * array.length)];
}

if (tttNote && tttModal && closeTttBtn) {
    tttNote.addEventListener('click', (e) => {
        e.stopPropagation();
        tttModal.classList.remove('hidden');
        resetTttBoard();
    });

    closeTttBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tttModal.classList.add('hidden');
        resetTttBoard();
        focusTerminal();
    });
}

document.body.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'reset-ttt-btn') {
        e.stopPropagation();
        resetTttBoard();
    }
});

function resetTttBoard() {
    boardState = {
        'TOP_LEFT': '', 'TOP_MIDDLE': '', 'TOP_RIGHT': '',
        'MIDDLE_LEFT': '', 'MIDDLE_MIDDLE': '', 'MIDDLE_RIGHT': '',
        'BOTTOM_LEFT': '', 'BOTTOM_MIDDLE': '', 'BOTTOM_RIGHT': ''
    };
    tttCells.forEach(cell => cell.innerHTML = '');
    tttMessage.textContent = getRandomDialogue(startDialogues);
    tttActive = true;
    playerTurn = true;
}

tttCells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!tttActive || !playerTurn) return;
        const cellId = cell.getAttribute('data-cell');
        if (boardState[cellId] !== '') return;

        makeMove(cellId, 'X');
        
        if (checkWin('X')) {
            endTttGame(getRandomDialogue(playerWinDialogues));
            return;
        }
        if (checkDraw()) {
            endTttGame(getRandomDialogue(drawDialogues));
            return;
        }

        playerTurn = false;
        tttMessage.textContent = 'THINKING...';
        
        setTimeout(aiMove, 1000);
    });
});

function makeMove(cellId, marker) {
    boardState[cellId] = marker;
    const cell = document.querySelector(`.ttt-cell[data-cell="${cellId}"]`);
    if (cell) {
        const img = document.createElement('img');
        if (marker === 'X') {
            img.src = `assets/environment/TTT/X/${cellId}_X.png`;
        } else {
            img.src = `assets/environment/TTT/CIRCLES/${cellId}_O.png`;
        }
        cell.appendChild(img);
    }
}

function evaluateBoard(board) {
    for (let combo of winCombinations) {
        if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            if (board[combo[0]] === 'O') return 10;
            if (board[combo[0]] === 'X') return -10;
        }
    }
    return 0;
}

function hasMovesLeft(board) {
    return Object.values(board).some(val => val === '');
}

function minimax(board, depth, isMax) {
    let score = evaluateBoard(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!hasMovesLeft(board)) return 0;

    if (isMax) {
        let best = -1000;
        for (let cellId in board) {
            if (board[cellId] === '') {
                board[cellId] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[cellId] = '';
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let cellId in board) {
            if (board[cellId] === '') {
                board[cellId] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[cellId] = '';
            }
        }
        return best;
    }
}

function findBestMove() {
    let bestVal = -1000;
    let bestMove = null;

    for (let cellId in boardState) {
        if (boardState[cellId] === '') {
            boardState[cellId] = 'O';
            let moveVal = minimax(boardState, 0, false);
            boardState[cellId] = '';

            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = cellId;
            }
        }
    }
    return bestMove;
}

function aiMove() {
    if (!tttActive) return;

    let targetMove = findBestMove();

    if (targetMove) {
        makeMove(targetMove, 'O');
        if (checkWin('O')) {
            endTttGame(getRandomDialogue(aiWinDialogues));
            return;
        }
        if (checkDraw()) {
            endTttGame(getRandomDialogue(drawDialogues));
            return;
        }
        playerTurn = true;
        tttMessage.textContent = getRandomDialogue(turnDialogues);
    }
}

function checkWin(marker) {
    return winCombinations.some(combo => {
        return combo.every(cellId => boardState[cellId] === marker);
    });
}

function checkDraw() {
    return Object.values(boardState).every(val => val !== '');
}

function endTttGame(msg) {
    tttActive = false;
    tttMessage.textContent = msg;

    let games = parseInt(localStorage.getItem('tttGamesPlayed') || '0');
    games++;
    localStorage.setItem('tttGamesPlayed', games.toString());
    
    if (games >= 5) {
        localStorage.setItem('tttCompleted', 'true');
        const tttTask = document.getElementById('task-7029');
        if (tttTask) {
            tttTask.classList.add('completed');
        }
    }
}