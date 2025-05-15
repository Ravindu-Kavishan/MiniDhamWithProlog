import React, { useState } from 'react';

const positions = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 200, y: 0 },
  { x: 0, y: 100 },
  { x: 100, y: 100 }, // center
  { x: 200, y: 100 },
  { x: 0, y: 200 },
  { x: 100, y: 200 },
  { x: 200, y: 200 },
];

export default function App() {
  const [tickPos, setTickPos] = useState({ x: 100, y: 100 }); // Start at center

  const handleDrop = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    // Snap to the closest predefined point
    let closest = positions[0];
    let minDist = Infinity;
    positions.forEach((pos) => {
      const dist = Math.hypot(dropX - pos.x, dropY - pos.y);
      if (dist < minDist) {
        minDist = dist;
        closest = pos;
      }
    });

    setTickPos(closest);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className="relative"
        style={{ width: 200, height: 200 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Board */}
        <svg width={200} height={200} className="absolute top-0 left-0">
          <rect x="0" y="0" width="200" height="200" stroke="black" strokeWidth="3" fill="none" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="black" strokeWidth="3" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="black" strokeWidth="3" />
          <line x1="0" y1="0" x2="200" y2="200" stroke="black" strokeWidth="3" />
          <line x1="200" y1="0" x2="0" y2="200" stroke="black" strokeWidth="3" />
        </svg>

        {/* Draggable Tick */}
        <div
          draggable
          className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-grab"
          style={{ left: tickPos.x - 8, top: tickPos.y - 8 }}
        ></div>
      </div>
    </div>
  );
}
