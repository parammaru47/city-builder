import React, { useState } from 'react';
import './App.css';

const GRID_SIZE = 8;

// A simple component for a draggable building
function DraggableBuilding({ type }) {
  const handleDragStart = (e) => {
    // Set the data to be the building's type
    e.dataTransfer.setData("buildingType", type);
  };

  return (
    <div className="building-block" draggable onDragStart={handleDragStart}>
      {type}
    </div>
  );
}

function App() {
  // Initialize an 8x8 grid with null values
  const [grid, setGrid] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );

  const handleDragOver = (e) => {
    // This is necessary to allow dropping
    e.preventDefault();
  };

  const handleDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();
    const buildingType = e.dataTransfer.getData("buildingType");

    // Check if the cell is empty and a valid building type is being dropped
    if (grid[rowIndex][colIndex] === null && buildingType) {
      // Create a new copy of the grid to avoid direct state mutation
      const newGrid = grid.map(row => [...row]);
      newGrid[rowIndex][colIndex] = buildingType;
      setGrid(newGrid);
    }
  };

  return (
    <div className="app-container">
      <div className="side-panel">
        <h2>Buildings</h2>
        <DraggableBuilding type="Hospital" />
        <DraggableBuilding type="Zoo" />
        <DraggableBuilding type="University" />
        <DraggableBuilding type="Garden" />
      </div>

      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          row.map((cellValue, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="grid-cell"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            >
              {cellValue} {/* Display the building type from the state */}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

export default App;