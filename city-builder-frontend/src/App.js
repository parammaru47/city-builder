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
  useEffect(() => {
    let newScore = 0;
    grid.flat().forEach(cell => {
      if (cell === "Hospital") newScore += 20;
      if (cell) newScore += 10;
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

  // submit
  const handleSubmit = async () => {
    const submissionData = {
      user: "defaultUser",
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
        alert(`Submission successful! Final Score: ${score}`);
        setIsSubmitted(true);
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Backend error.");
    }
  };

  return (
    <div className={`app-container ${isSubmitted ? 'submitted' : ''}`}>
      <div className="side-panel">
        <h2>Buildings</h2>
        <DraggableBuilding type="Hospital" />
        <DraggableBuilding type="Zoo" />
        <DraggableBuilding type="University" />
        <DraggableBuilding type="Garden" />
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
                draggable={cellValue !== null}
                onDragStart={(e) => handleCellDragStart(e, rowIndex, colIndex, cellValue)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
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
      </div>


    </div>
  );
}

export default App;
