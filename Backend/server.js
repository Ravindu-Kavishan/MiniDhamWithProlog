const express = require("express");
const cors = require("cors");
const { startGame } = require("./utils"); 

const app = express();

app.use(cors());
app.use(express.json());

app.post("/start-game", async (req, res) => {
  try {
    const UserPositions = req.body.input; // Example: ["a", "b", "e"]
    const result = await startGame(UserPositions);
    res.json({ result });
  } catch (err) {
    console.error("Shell execution error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
