import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 8;

function DraggableBuilding({ label, emoji }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("buildingType", emoji);
  };
  return (
    <div className="building-block" draggable onDragStart={handleDragStart}>
      {label} {emoji}
    </div>
  );
}


function App() {
  const [grid, setGrid] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [roads, setRoads] = useState(
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => [false, false, false, false])
    )
  );
  const [isRoadMode, setIsRoadMode] = useState(false);
  const [lastClickedCell, setLastClickedCell] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [economyScore, setEconomyScore] = useState(0);
  const [sustainabilityScore, setSustainabilityScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [username, setUsername] = useState("defaultUser");

  // scoring
  const buildingData = {
    "🏥": { name: "Hospital", economy: 5, sustainability: 15 },
    "🏫": { name: "School", economy: 10, sustainability: 15 },
    "🎓": { name: "University", economy: 15, sustainability: 15 },
    "💧": { name: "Clean Water", economy: 5, sustainability: 20 },
    "☀️": { name: "Solar Plant", economy: 10, sustainability: 20 },
    "🌳": { name: "Park", economy: 0, sustainability: 15 },
    "🦁": { name: "Zoo", economy: 5, sustainability: 10 },
    "🎋": { name: "Garden", economy: 0, sustainability: 10 },
    "🏭": { name: "Factory", economy: 20, sustainability: -15 },
    "🗑️": { name: "Landfill", economy: 0, sustainability: -20 },
    "🛣️": { name: "Highway", economy: 5, sustainability: -5 },
    "🚑": { name: "Hospital Waste", economy: 0, sustainability: -15 },
    "🚰": { name: "Water Treatment", economy: 5, sustainability: 15 },
    "♻️": { name: "Recycling Plant", economy: 5, sustainability: 15 },
    "🌬️": { name: "Wind Turbine", economy: 10, sustainability: 20 },
    "⚠️": { name: "Polluting Factory", economy: 25, sustainability: -25 },
    "🏘️": { name: "Affordable Housing", economy: 10, sustainability: 10 },
    "🚨": { name: "Illegal Dumping", economy: 5, sustainability: -20 },
    "🏛️": { name: "Community Center", economy: 5, sustainability: 10 },
  };

  useEffect(() => {
    let newEconomy = 0;
    let newSustainability = 0;

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell && buildingData[cell]) {
          const cellRoads = roads[rowIndex][colIndex];
          const hasRoad = cellRoads.some(Boolean);

          if (hasRoad) {
            newEconomy += buildingData[cell].economy;
            newSustainability += buildingData[cell].sustainability;
          }
        }
      });
    });
    roads.flat().forEach(cellRoads => {
      const roadPenalty = cellRoads.filter(Boolean).length / 2;
      newEconomy -= roadPenalty;
      newSustainability -= roadPenalty;
    });

    setEconomyScore(Math.max(0, Math.round(newEconomy)));
    setSustainabilityScore(Math.max(0, Math.round(newSustainability)));
  }, [grid, roads]);

  useEffect(() => {
    fetchHighscores();
  }, []);


  // drag + drop
  const handleDragOver = (e) => e.preventDefault();

  const handleCellDragStart = (e, rowIndex, colIndex, buildingType) => {
    e.dataTransfer.setData("buildingType", buildingType);
    e.dataTransfer.setData("sourceRow", rowIndex);
    e.dataTransfer.setData("sourceCol", colIndex);
  };

  const handleDrop = (e, destRow, destCol) => {
    e.preventDefault();
    const buildingType = e.dataTransfer.getData("buildingType");
    const sourceRow = e.dataTransfer.getData("sourceRow");
    const sourceCol = e.dataTransfer.getData("sourceCol");

    if (grid[destRow][destCol] === null && buildingType) {
      const newGrid = grid.map(row => [...row]);
      if (sourceRow !== "" && sourceCol !== "") {
        newGrid[sourceRow][sourceCol] = null;
      }
      newGrid[destRow][destCol] = buildingType;
      setGrid(newGrid);
    }
  };

  // road drawing
  const handleCellClick = (rowIndex, colIndex) => {
    if (!isRoadMode) return;
    if (lastClickedCell) {
      const [lastRow, lastCol] = lastClickedCell;
      const newRoads = roads.map(r => r.map(c => [...c]));
      if (rowIndex === lastRow && colIndex === lastCol + 1) {
        const isConnected = newRoads[lastRow][lastCol][1];
        newRoads[lastRow][lastCol][1] = !isConnected;
        newRoads[rowIndex][colIndex][3] = !isConnected;
      } else if (rowIndex === lastRow && colIndex === lastCol - 1) {
        const isConnected = newRoads[lastRow][lastCol][3];
        newRoads[lastRow][lastCol][3] = !isConnected;
        newRoads[rowIndex][colIndex][1] = !isConnected;
      } else if (colIndex === lastCol && rowIndex === lastRow + 1) {
        const isConnected = newRoads[lastRow][lastCol][2];
        newRoads[lastRow][lastCol][2] = !isConnected;
        newRoads[rowIndex][colIndex][0] = !isConnected;
      } else if (colIndex === lastCol && rowIndex === lastRow - 1) {
        const isConnected = newRoads[lastRow][lastCol][0];
        newRoads[lastRow][lastCol][0] = !isConnected;
        newRoads[rowIndex][colIndex][2] = !isConnected;
      }

      setRoads(newRoads);
      setLastClickedCell(null);
    } else {
      setLastClickedCell([rowIndex, colIndex]);
    }
  };

  const [highscores, setHighscores] = useState([]);

  const fetchHighscores = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/submissions');
      const data = await response.json();
      setHighscores(data);
    } catch (error) {
      console.error("Error fetching highscores:", error);
    }
  };

  const lockGrid = () => {
    setIsSubmitted(true);
  };

  const flashScore = () => {
    const scoreEls = document.querySelectorAll(".score-container h3");
    scoreEls.forEach(el => el.classList.add("flash-score"));
    setTimeout(() => {
      scoreEls.forEach(el => el.classList.remove("flash-score"));
    }, 1500);
  };



  // submit
  const handleSubmit = async () => {
    const submissionData = {
      user: username || "defaultUser",
      gridState: JSON.stringify(grid),
      economyScore: economyScore,
      sustainabilityScore: sustainabilityScore,
    };



    try {
      const response = await fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        flashScore();
        setIsSubmitted(true);
        lockGrid();
        fetchHighscores();
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Backend error.");
    }
  };



  return (
    <div className={`app-container ${isSubmitted ? 'submitted' : ''}`}>
      <div className="side-panel">
        <h2>Buildings</h2>
        <DraggableBuilding label="Hospital" emoji="🏥" />
        <DraggableBuilding label="School" emoji="🏫" />
        <DraggableBuilding label="University" emoji="🎓" />
        <DraggableBuilding label="Clean Water" emoji="💧" />
        <DraggableBuilding label="Solar Plant" emoji="☀️" />
        <DraggableBuilding label="Park" emoji="🌳" />
        <DraggableBuilding label="Zoo" emoji="🦁" />
        <DraggableBuilding label="Garden" emoji="🎋" />
        <DraggableBuilding label="Factory" emoji="🏭" />
        <DraggableBuilding label="Landfill" emoji="🗑️" />
        <DraggableBuilding label="Highway" emoji="🛣️" />
        <DraggableBuilding label="Hospital Waste" emoji="🚑" />
        <DraggableBuilding label="Water Treatment" emoji="🚰" />
        <DraggableBuilding label="Recycling Plant" emoji="♻️" />
        <DraggableBuilding label="Wind Turbine" emoji="🌬️" />
        <DraggableBuilding label="Polluting Factory" emoji="⚠️" />
        <DraggableBuilding label="Affordable Housing" emoji="🏘️" />
        <DraggableBuilding label="Illegal Dumping" emoji="🚨" />
        <DraggableBuilding label="Community Center" emoji="🏛️" />

      </div>

      <div className="grid-container">
        {grid.map((row, rowIndex) =>
          row.map((cellValue, colIndex) => {
            const cellRoads = roads[rowIndex][colIndex];
            const roadClasses = `
              ${cellRoads[0] ? 'road-top' : ''}
              ${cellRoads[1] ? 'road-right' : ''}
              ${cellRoads[2] ? 'road-bottom' : ''}
              ${cellRoads[3] ? 'road-left' : ''}
            `;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${roadClasses}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                draggable={!isSubmitted && cellValue !== null}
                onDragStart={(e) => handleCellDragStart(e, rowIndex, colIndex, cellValue)}
                onClick={!isSubmitted ? () => handleCellClick(rowIndex, colIndex) : null}
                onContextMenu={(e) => {
                  e.preventDefault();  // prevent default right-click menu
                  if (!isSubmitted && grid[rowIndex][colIndex]) {
                    const newGrid = grid.map(row => [...row]);
                    newGrid[rowIndex][colIndex] = null;
                    setGrid(newGrid);
                  }
                }}
                title={cellValue ? buildingData[cellValue].name : ""}
              >
                {cellValue}
              </div>

            );
          })
        )}
      </div>

      <div className="score-container">
        <h3>Economy: {economyScore}</h3>
        <div className="score-bar-background">
          <div
            className="score-bar-foreground"
            style={{ width: `${Math.min(economyScore, 100)}%`, background: "linear-gradient(to right, #ffd700, #ff8c00)" }}
          />
        </div>

        <h3>Sustainability: {sustainabilityScore}</h3>
        <div className="score-bar-background">
          <div
            className="score-bar-foreground"
            style={{ width: `${Math.min(sustainabilityScore, 100)}%`, background: "linear-gradient(to right, #38ef7d, #0f9b8e)" }}
          />
        </div>

        <button
          onClick={() => setIsRoadMode(!isRoadMode)}
          className={`button button-road-mode ${isRoadMode ? 'active' : ''}`}
        >
          {isRoadMode ? "Road Mode" : "Road Mode"}
        </button>

        <div className="username-input-container">
          <label htmlFor="username">Your Name: </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            disabled={isSubmitted}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitted}
          className="button button-submit"
        >
          {isSubmitted ? "Submitted" : "Submit Layout"}
        </button>

        <div className="highscores-panel">
          <h3>Top Sustainable Cities</h3>
          <ol>
            {highscores
              .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
              .slice(0, 10)
              .map((entry, id) => (
                <li
                  key={id}
                  className={id === 0 ? "top-score" : ""}
                >
                  {entry.user} <br /> Sustainability {entry.sustainabilityScore} <br /> Economy {entry.economyScore}
                </li>
              ))}
          </ol>
        </div>


      </div>

      <button
        className="info-button"
        onClick={() => setShowInfo(prev => !prev)}
      >
        ℹ
      </button>

      {showInfo && (
        <div className={`info-modal ${showInfo ? "show" : ""}`}>
          <h3>Game Rules</h3>
          <ul>
            <li>Drag buildings from the left panel onto the grid.</li>
            <li>Enable Road Mode to connect buildings with roads.</li>
            <li>A building only contributes score if connected to at least one road.</li>
            <li>Roads give small penalties, but are required for scoring.</li>
            <li>Click the same road connection again to remove it.</li>
            <li>Right-click on a cell to remove a building.</li>
            <li>Submit your layout once finished.</li>
          </ul>
        </div>
      )}

    </div>
  );
}

export default App;
