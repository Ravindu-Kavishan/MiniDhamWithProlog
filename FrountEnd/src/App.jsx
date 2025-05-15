import React, { useState } from 'react';

const namedPositions = {
  a: { x: 0, y: 0 },
  b: { x: 100, y: 0 },
  c: { x: 200, y: 0 },
  d: { x: 0, y: 100 },
  e: { x: 100, y: 100 },
  f: { x: 200, y: 100 },
  g: { x: 0, y: 200 },
  h: { x: 100, y: 200 },
  i: { x: 200, y: 200 },
};

const getClosestPositionName = (x, y) => {
  let closest = 'a';
  let minDist = Infinity;
  for (const [key, pos] of Object.entries(namedPositions)) {
    const dist = Math.hypot(x - pos.x, y - pos.y);
    if (dist < minDist) {
      minDist = dist;
      closest = key;
    }
  }
  return closest;
};

export default function App() {
  const [ticks, setTicks] = useState([
    { position: null },
    { position: null },
    { position: null },
  ]);

  const handleDrop = (e) => {
    const tickIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;
    const nearest = getClosestPositionName(dropX, dropY);

    // Allow only one tick per position
    const isOccupied = ticks.some((tick, index) => tick.position === nearest && index !== tickIndex);
    if (isOccupied) return;

    const newTicks = ticks.map((tick, index) =>
      index === tickIndex ? { position: nearest } : tick
    );
    setTicks(newTicks);
  };

  const handlePrint = () => {
    const positions = ticks
      .filter(tick => tick.position)
      .map(tick => tick.position);
    console.log(positions);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      {/* Ticks outside */}
      <div className="flex gap-4">
        {ticks.map((tick, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
            className="w-4 h-4 bg-blue-500 rounded-full cursor-grab"
            style={{ visibility: tick.position ? 'hidden' : 'visible' }}
          ></div>
        ))}
      </div>

      {/* Board */}
      <div
        className="relative"
        style={{ width: 200, height: 200 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* SVG board */}
        <svg width={200} height={200} className="absolute top-0 left-0">
          <rect x="0" y="0" width="200" height="200" stroke="black" strokeWidth="3" fill="none" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="black" strokeWidth="3" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="black" strokeWidth="3" />
          <line x1="0" y1="0" x2="200" y2="200" stroke="black" strokeWidth="3" />
          <line x1="200" y1="0" x2="0" y2="200" stroke="black" strokeWidth="3" />
        </svg>

        {/* Board labels */}
        {Object.entries(namedPositions).map(([name, pos]) => (
          <span
            key={name}
            className="absolute text-xs text-black"
            style={{
              left: pos.x + 8,
              top: pos.y + 8,
              pointerEvents: 'none',
            }}
          >
            {name}
          </span>
        ))}

        {/* Ticks on board */}
        {ticks.map((tick, index) => {
          if (!tick.position) return null;
          const pos = namedPositions[tick.position];
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
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
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handlePrint}
      >
        Log Tick Positions
      </button>
    </div>
  );
}
