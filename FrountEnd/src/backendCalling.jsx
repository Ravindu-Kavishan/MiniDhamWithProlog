function startGame(userPositions, setFixedRedTicks, setErrmsg) {
  fetch("http://localhost:3001/start-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UserPositions: userPositions }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Prolog result (string):", data.result);
      if (data.result === "invalid positions_3318") {
        setErrmsg("Invalid Placement.");
      } else {
        const jsonString = data.result.replace(/([a-zA-Z])/g, '"$1"');

        let resultArray;
        try {
          resultArray = JSON.parse(jsonString);
        } catch (err) {
          console.error("Error parsing Prolog result string to array:", err);
          resultArray = [];
        }

        if (Array.isArray(resultArray) && resultArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * resultArray.length);
          const selected = resultArray[randomIndex];
          setFixedRedTicks(selected);
        } else {
          console.warn("No valid result received from backend.");
        }
      }
      // Convert letters without quotes into valid JSON string with quotes
    })
    .catch((error) => {
      console.error("Error fetching from backend:", error);
    });
}

function getNextMovement(
  userPositions,
  fixedRedTicks,
  setFixedRedTicks,
  setMessage,
  setErrmsg
) {
  fetch("http://localhost:3001/get-next-movement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UserPositions: userPositions,
      MyPositions: fixedRedTicks,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Prolog result (string):", data.result);
      if (data.result === "you are won_3318") {
        setMessage("you are won");
      } else if (data.result === "I am won_3318") {
        setErrmsg("I am won.");
      } else {
        const fixedString = data.result.replace(/([a-zA-Z])/g, '"$1"');
        const positionsArray = JSON.parse(fixedString);
        setFixedRedTicks(positionsArray);
      }
    })
    .catch((error) => {
      console.error("Error fetching from backend:", error);
    });
}

export { startGame, getNextMovement };
