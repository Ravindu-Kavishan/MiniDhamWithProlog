import React, { useState } from "react";
import { startGame, getNextMovement } from "./backendCalling";
import { getClosestPositionName, namedPositions, handleDrop } from "./utils";

export default function App() {
  const [initialUserPositions, setInitialUserPositions] = useState([]);
  const [userTicks, setUserTicks] = useState([
    { position: null },
    { position: null },
    { position: null },
  ]);
  const [fixedRedTicks, setFixedRedTicks] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [errmsg, setErrmsg] = useState("");

  const handlePrintAndFetch = () => {
    const userPositions = userTicks
      .filter((tick) => tick.position)
      .map((tick) => tick.position);

    if (!isStarted) {
      // Make sure all ticks are placed
      if (userPositions.length === 3) {
        startGame(userPositions, setFixedRedTicks, setErrmsg);
        setInitialUserPositions(userPositions);
        setIsStarted(true);
      }
    } else {
      // Game already started — check if exactly one tick has moved
      let changedCount = 0;
      for (let i = 0; i < 3; i++) {
        if (userPositions[i] !== initialUserPositions[i]) {
          changedCount++;
        }
      }

      if (changedCount === 1) {
        console.log("Red ticks:", fixedRedTicks);
        getNextMovement(
          userPositions,
          fixedRedTicks,
          setFixedRedTicks,
          setMessage,
          setErrmsg
        );
        setInitialUserPositions(userPositions); // update for next move
      } else {
        alert("You can only move ONE blue tick before pressing play.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <div className="text-green-600">
        <h1>{message}</h1>
      </div>
      <div className="text-red-600">
        <h1>{errmsg}</h1>
      </div>
      {/* Draggable Blue Ticks */}
      <div className="flex gap-4">
        {userTicks.map((tick, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
            className="w-4 h-4 bg-blue-500 rounded-full cursor-grab"
            style={{ visibility: tick.position ? "hidden" : "visible" }}
          ></div>
        ))}
      </div>

      <div
        className="relative"
        style={{ width: 200, height: 200 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, userTicks, fixedRedTicks, setUserTicks)}
      >
        {/* SVG board */}
        <svg width={200} height={200} className="absolute top-0 left-0">
          <rect
            x="0"
            y="0"
            width="200"
            height="200"
            stroke="black"
            strokeWidth="3"
            fill="none"
          />
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="200"
            stroke="black"
            strokeWidth="3"
          />
          <line
            x1="0"
            y1="100"
            x2="200"
            y2="100"
            stroke="black"
            strokeWidth="3"
          />
          <line
            x1="0"
            y1="0"
            x2="200"
            y2="200"
            stroke="black"
            strokeWidth="3"
          />
          <line
            x1="200"
            y1="0"
            x2="0"
            y2="200"
            stroke="black"
            strokeWidth="3"
          />
        </svg>

        {/* Red (fixed) ticks */}
        {fixedRedTicks.map((pos, index) => {
          const coords = namedPositions[pos];
          return (
            <div
              key={`red-${index}`}
              className="absolute w-4 h-4 bg-red-500 rounded-full"
              style={{
                left: coords.x - 8,
                top: coords.y - 8,
              }}
            ></div>
          );
        })}

        {/* Blue (user) ticks */}
        {userTicks.map((tick, index) => {
          if (!tick.position) return null;
          const pos = namedPositions[tick.position];
          return (
            <div
              key={`user-${index}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
              className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-grab"
              style={{
                left: pos.x - 8,
                top: pos.y - 8,
              }}
            ></div>
          );
        })}
      </div>

      {/* Button */}
      {/* Button (only show if no error) */}
      {!errmsg && (
        <button
          className={`mt-4 px-4 py-2 rounded text-white transition-colors ${
            userTicks.every((tick) => tick.position)
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handlePrintAndFetch}
          disabled={!userTicks.every((tick) => tick.position)}
        >
          {isStarted ? "Play" : "Start"}
        </button>
      )}
    </div>
  );
}
