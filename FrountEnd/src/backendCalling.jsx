function startGame(userPositions, setFixedRedTicks) {
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

      // Convert letters without quotes into valid JSON string with quotes
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
    })
    .catch((error) => {
      console.error("Error fetching from backend:", error);
    });
}

export { startGame };
