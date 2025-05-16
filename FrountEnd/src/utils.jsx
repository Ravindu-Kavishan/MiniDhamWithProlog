// utils.js
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

function getClosestPositionName(x, y) {
  let closest = "a";
  let minDist = Infinity;
  for (const [key, pos] of Object.entries(namedPositions)) {
    const dist = Math.hypot(x - pos.x, y - pos.y);
    if (dist < minDist) {
      minDist = dist;
      closest = key;
    }
  }
  return closest;
}

// handleDrop now takes state and setter as params
function handleDrop(e, userTicks, fixedRedTicks, setUserTicks) {
  const tickIndex = parseInt(e.dataTransfer.getData("text/plain"));
  const rect = e.currentTarget.getBoundingClientRect();
  const dropX = e.clientX - rect.left;
  const dropY = e.clientY - rect.top;
  const nearest = getClosestPositionName(dropX, dropY);

  const redOccupied = fixedRedTicks.includes(nearest);
  const alreadyUsed = userTicks.some(
    (tick, idx) => tick.position === nearest && idx !== tickIndex
  );

  if (redOccupied || alreadyUsed) return;

  const newTicks = userTicks.map((tick, index) =>
    index === tickIndex ? { position: nearest } : tick
  );
  setUserTicks(newTicks);
}

export { namedPositions, getClosestPositionName, handleDrop };
