import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 8;

function DraggableBuilding({ type }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("buildingType", type);
  };
  return (
    <div className="building-block" draggable onDragStart={handleDragStart}>
      {type}
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
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);



  // scoring

  const buildingScores = {
    "Hospital 🏥": 20,
    "School 🏫": 15,
    "University 🎓": 15,
    "Clean Water 💧": 10,
    "Solar Plant ☀️": 10,
    "Park 🌳": 10,
    "Zoo 🦁": 10,
    "Garden 🎋": 10,
    "Factory 🏭": -5,
    "Landfill 🗑️": -10,
    "Highway 🛣️": 0,
    "Hospital Waste 🚑": -15,
    "Water Treatment 🚰": 10,
    "Recycling Plant ♻️": 10,
    "Wind Turbine 🌬️": 10,
    "Polluting Factory ⚠️": -15,
    "Affordable Housing 🏘️": 15,
    "Illegal Dumping 🚨": -20,
    "Community Center 🏛️": 10,
  };

  useEffect(() => {
    let newScore = 0;

    grid.flat().forEach(cell => {
      if (cell && buildingScores[cell]) {
        newScore += buildingScores[cell];
      }
    });

    roads.flat().forEach(cellRoads => {
      newScore -= cellRoads.filter(Boolean).length / 2;
    });

    setScore(Math.max(0, Math.round(newScore)));
  }, [grid, roads]);
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
        newRoads[lastRow][lastCol][1] = true;
        newRoads[rowIndex][colIndex][3] = true;
      } else if (rowIndex === lastRow && colIndex === lastCol - 1) {
        newRoads[lastRow][lastCol][3] = true;
        newRoads[rowIndex][colIndex][1] = true;
      } else if (colIndex === lastCol && rowIndex === lastRow + 1) {
        newRoads[lastRow][lastCol][2] = true;
        newRoads[rowIndex][colIndex][0] = true;
      } else if (colIndex === lastCol && rowIndex === lastRow - 1) {
        newRoads[lastRow][lastCol][0] = true;
        newRoads[rowIndex][colIndex][2] = true;
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
      const response = await fetch('http://localhost:8080/api/submissions/top');
      const data = await response.json();
      setHighscores(data);
    } catch (error) {
      console.error("Error fetching highscores:", error);
    }
  };


  function Highscores({ highscores }) {
    return (
      <div className="highscores-panel">
        <h3>Top Scores</h3>
        <ol>
          {highscores.map((entry, index) => (
            <li key={index}>
              {entry.user}: {entry.score}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const lockGrid = () => {
    setIsSubmitted(true);
  };

  const flashScore = () => {
    const scoreEl = document.querySelector(".score-container h3");
    if (scoreEl) {
      scoreEl.classList.add("flash-score");
      setTimeout(() => scoreEl.classList.remove("flash-score"), 1500);
    }
  };


  // submit
  const handleSubmit = async () => {
    const submissionData = {
      user: "defaultUser",          // can be dynamic
      grid_state: JSON.stringify(grid),
      score: score,
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
        <DraggableBuilding type="Hospital 🏥" />
        <DraggableBuilding type="School 🏫" />
        <DraggableBuilding type="University 🎓" />
        <DraggableBuilding type="Clean Water 💧" />
        <DraggableBuilding type="Solar Plant ☀️" />
        <DraggableBuilding type="Park 🌳" />
        <DraggableBuilding type="Zoo 🦁" />
        <DraggableBuilding type="Garden 🎋" />
        <DraggableBuilding type="Factory 🏭" />
        <DraggableBuilding type="Landfill 🗑️" />
        <DraggableBuilding type="Highway 🛣️" />
        <DraggableBuilding type="Hospital Waste 🚑" />
        <DraggableBuilding type="Water Treatment 🚰" />
        <DraggableBuilding type="Recycling Plant ♻️" />
        <DraggableBuilding type="Wind Turbine 🌬️" />
        <DraggableBuilding type="Polluting Factory ⚠️" />
        <DraggableBuilding type="Affordable Housing 🏘️" />
        <DraggableBuilding type="Illegal Dumping 🚨" />
        <DraggableBuilding type="Community Center 🏛️" />
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
              >
                {cellValue}
              </div>
            );
          })
        )}
      </div>

      <div className="score-container">
        <h3>Live Score: {score}</h3>
        <div className="score-bar-background">
          <div
            className="score-bar-foreground"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
        <button
          onClick={() => setIsRoadMode(!isRoadMode)}
          className={`button button-road-mode ${isRoadMode ? 'active' : ''}`}
        >
          {isRoadMode ? "Disable Road Mode" : "Enable Road Mode"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitted}
          className="button button-submit"
        >
          {isSubmitted ? "Submitted" : "Submit Layout"}
        </button>
      </div>


    </div>
  );
}

export default App;
