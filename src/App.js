import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = isWinningSquare ? "square winning" : "square";
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  let winningSquares = [];

  if (winner) {
    status = 'Winner: ' + winner.winner;
    winningSquares = winner.line;
  } else if (squares.every((square) => square)) {
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const isWinningSquare = winningSquares.includes(squareIndex);
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          isWinningSquare={isWinningSquare}
          onSquareClick={() => handleClick(squareIndex)}
        />
      );
    }
    boardRows.push(
      <div className="board-row" key={row}>{rowSquares}</div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [sortAscending, setSortAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1);
    const location = calculateLocation(currentSquares, nextSquares);
    nextHistory.push({ squares: nextSquares, moveLocation: location });
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const sortType = sortAscending ? 'Ascending' : 'Descending ';

  // Create a copy of history to sort based on sortAscending
  const sortedHistory = sortAscending ? history.slice() : history.slice().reverse();

  const moves = sortedHistory.map((step, move) => {
    const curMove = sortAscending ? move : history.length - move - 1;
    const location = step.moveLocation;
    let description;
    if (curMove > 0) {
      if (location && location.row !== null && location.col !== null) {
        description = `Go to move #${curMove} (${location.row}, ${location.col})`;
      } else {
        description = `Go to move #${curMove}`;
      }
    } else {
      description = 'Go to game start';
    }

    if (curMove === currentMove) {
      if (location && location.row !== null && location.col !== null) {
        description = `You are at move #${curMove} (${location.row}, ${location.col})`;
      } else {
        description = `You are at move #${curMove}`;
      }
    }

    return (
      <li key={curMove}>
        {curMove === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(curMove)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleSort}>{sortType}</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateLocation(prevSquares, nextSquares) {
  for (let i = 0; i < nextSquares.length; i++) {
    if (nextSquares[i] !== prevSquares[i]) {
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) + 1;
      return { row, col };
    }
  }
  return { row: null, col: null };
}