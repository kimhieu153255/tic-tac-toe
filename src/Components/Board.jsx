import { useEffect, useRef, useState } from "react";
import Square from "./Square";

const checkDraw = (count) => {
  if (count >= 9) return true;
  return false;
};

const checkWinner = (arr) => {
  for (let i = 0; i < 3; i++) {
    if (
      arr[i][0] !== null &&
      arr[i][0] === arr[i][1] &&
      arr[i][1] === arr[i][2]
    ) {
      return {
        winner: arr[i][0],
        winLine: [
          [i, 0],
          [i, 1],
          [i, 2],
        ],
      };
    }
    if (
      arr[0][i] !== null &&
      arr[0][i] === arr[1][i] &&
      arr[1][i] === arr[2][i]
    ) {
      return {
        winner: arr[0][i],
        winLine: [
          [0, i],
          [1, i],
          [2, i],
        ],
      };
    }
  }
  if (
    arr[0][0] !== null &&
    arr[0][0] === arr[1][1] &&
    arr[1][1] === arr[2][2]
  ) {
    return {
      winner: arr[0][0],
      winLine: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    };
  }
  if (
    arr[0][2] !== null &&
    arr[0][2] === arr[1][1] &&
    arr[1][1] === arr[2][0]
  ) {
    return {
      winner: arr[0][2],
      winLine: [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    };
  }
  return null;
};

const Board = () => {
  const [state, setState] = useState(
    new Array(3).fill(null).map(() => new Array(3).fill(null))
  );
  const [history, setHistory] = useState([state]);
  const [xIsNext, setXIsNext] = useState(true);
  const [count, setCount] = useState(0);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [step, setStep] = useState([]);

  const handle = () => {
    const isDraw = checkDraw(count);
    if (isDraw) setWinner("Draw");
    const isWinner = checkWinner(state);
    if (isWinner) {
      setWinner(`${isWinner.winner} is winner`);
      setWinLine(() => isWinner.winLine);
    }
  };

  const onPlay = (row, col) => {
    if (winner) return;
    if (state[row][col] !== null) return;
    const newArr = [...JSON.parse(JSON.stringify(state))];
    newArr[row][col] = xIsNext ? "X" : "O";
    //save history and step
    setHistory((history) => [...history.slice(0, count + 1), newArr]);
    setStep([...step.slice(0, count), { id: count, row, col }]);
    setState(newArr);
    setXIsNext(!xIsNext);
    setCount(count + 1);
  };

  const handleRef = useRef();
  handleRef.current = handle;
  useEffect(() => {
    handleRef.current();
  }, [state, count, winner]);

  return (
    <div className="h-screen w-full flex justify-center gap-10 ">
      <div className="flex flex-col gap-3 items-center my-auto ">
        <div className="font-bold text-4xl text-center line-clamp-2">
          THIS IS A GAME MADE BY LE KIM HIEU - 20120474
        </div>
        <div
          className={`text-center text-5xl font-bold ${
            winner === "Draw" && "text-yellow-500"
          } ${winner === "X is winner" && "text-red-500"} ${
            winner === "O is winner" && "text-blue-500"
          }`}
        >
          {winner}
        </div>
        <div className="min-w-max">
          {state.map((row, i) => (
            <div className="board-row flex justify-center items-center" key={i}>
              {row.map((cell, j) => (
                <Square
                  key={j}
                  value={cell}
                  isPaint={
                    winLine.filter((item) => item[0] === i && item[1] === j)
                      .length > 0 && winner
                  }
                  onPlay={() => {
                    onPlay(i, j);
                  }}
                ></Square>
              ))}
            </div>
          ))}
        </div>
        {!winner && (
          <div className="text-center text-2xl font-bold">
            {xIsNext ? "X" : "O"} is next
          </div>
        )}
      </div>
      {/* map step */}
      {
        <div className=" w-80 mt-40">
          <div className="flex">
            <div
              className="px-5 py-3 bg-blue-500 text-center border rounded-md w-fit hover:bg-blue-600 cursor-pointer transition duration-300 ease-in-out font-bold text-white min-w-max"
              onClick={() => {
                setState(
                  new Array(3).fill(null).map(() => new Array(3).fill(null))
                );
                setXIsNext(true);
                setCount(0);
                setWinner(null);
                setWinLine([]);
                setStep([]);
                setHistory([
                  new Array(3).fill(null).map(() => new Array(3).fill(null)),
                ]);
              }}
            >
              Clear Board
            </div>
            <div
              className="px-5 py-3 bg-green-500 text-center border rounded-md w-fit hover:bg-green-600 cursor-pointer transition duration-300 ease-in-out font-bold text-white min-w-max"
              onClick={() => {
                if (step.length === 0) return;
                const newArr = [...step.reverse()];
                setStep(newArr);
                setToggle(!toggle);
              }}
            >
              Toggle {toggle ? "Ascending" : "Descending"}
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-max">
            <span className="text-2xl font-bold">List step:</span>
            {step.map((item, index) => {
              if (item.id === count - 1)
                return (
                  <div className="text-lg font-semibold">
                    You are at move #{count - 1}
                  </div>
                );
              else
                return (
                  <button
                    key={index}
                    className="text-lg font-semibold text-white px-5 py-2 bg-gray-400 text-center border rounded-md w-fit hover:bg-gray-500 cursor-pointer transition duration-300 ease-in-out"
                    onClick={() => {
                      setState(history[item.id + 1]);
                      setXIsNext((item.id + 1) % 2 === 0);
                      setCount(item.id + 1);
                      setWinner(null);
                    }}
                  >
                    Go to move #{item.id}: ({item.row}, {item.col})
                  </button>
                );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export default Board;
