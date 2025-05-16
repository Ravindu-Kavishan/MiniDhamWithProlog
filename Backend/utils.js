const { exec } = require("child_process");

function startGame(UserPositions) {
  return new Promise((resolve, reject) => {
    const prologList = `[${UserPositions.join(",")}]`; // Convert JS array to Prolog list
    const command = `swipl -s prologLogick.pl -g "start_game(${prologList},${prologList},X), write(X), nl, halt."`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`Execution error: ${error.message}`);
      }
      if (stderr) {
        return reject(`Shell stderr: ${stderr}`);
      }
      const resultString = stdout.trim().replace(/\r?\n/g, "");
      resolve(resultString);
    });
  });
}

function getNextMovement(UserPositions, MyPositions) {
  return new Promise((resolve, reject) => {
    const UserPositionspl = `[${UserPositions.join(",")}]`; // Convert JS array to Prolog list
    const MyPositionspl = `[${MyPositions.join(",")}]`; // Convert JS array to Prolog list
    const command = `swipl -s prologLogick.pl -g "get_next_movement(${UserPositionspl},${MyPositionspl},X), write(X), nl, halt."`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`Execution error: ${error.message}`);
      }
      if (stderr) {
        return reject(`Shell stderr: ${stderr}`);
      }
      const resultString = stdout.trim().replace(/\r?\n/g, "");
      resolve(resultString);
    });
  });
}

module.exports = { startGame ,getNextMovement};
