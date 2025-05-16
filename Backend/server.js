const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();

app.use(cors()); // Allow all origins
app.use(express.json());

function runDirCommand() {
  return new Promise((resolve, reject) => {
    exec(
      'swipl -s prologLogick.pl -g "start_game([a,b,e],[a,b,e],X), write(X), nl, halt."',
      (error, stdout, stderr) => {
        if (error) {
          return reject(`Execution error: ${error.message}`);
        }
        if (stderr) {
          return reject(`Shell stderr: ${stderr}`);
        }

        // Join lines into one string
        const resultString = stdout.trim().split("\r\n").join("");
        resolve(resultString);
      }
    );
  });
}

app.post("/run-prolog", async (req, res) => {
  try {
    const result = await runDirCommand();
    res.json({ result });  // result is now a string
  } catch (err) {
    console.error("Shell execution error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
