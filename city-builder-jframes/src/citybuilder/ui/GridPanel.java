package citybuilder.ui;

import citybuilder.model.GameScore; // Import new model
import javax.swing.*;
import java.awt.*;
import java.awt.dnd.*;
import java.awt.datatransfer.*;
import java.util.HashMap; // Import
import java.util.Map; // Import
import java.util.function.Consumer; // Import

public class GridPanel extends JPanel {
    private static final int GRID_SIZE = 8;
    private final String[][] gridState = new String[GRID_SIZE][GRID_SIZE];
    private final CellPanel[][] cells = new CellPanel[GRID_SIZE][GRID_SIZE];

    // Listener updated to use GameScore
    private Consumer<GameScore> scoreListener;
    private GameScore currentScore; // Store current score

    // Building data map from your snippet
    private static final Map<String, int[]> buildingData = new HashMap<>();
    static {
        buildingData.put("🏥", new int[]{5, 15});
        buildingData.put("🏫", new int[]{10, 15});
        buildingData.put("🎓", new int[]{15, 15});
        buildingData.put("💧", new int[]{5, 20});
        buildingData.put("☀️", new int[]{10, 20});
        buildingData.put("🌳", new int[]{0, 15});
        buildingData.put("🦁", new int[]{5, 10});
        buildingData.put("🎋", new int[]{0, 10});
        buildingData.put("🏭", new int[]{20, -15});
        buildingData.put("🗑️", new int[]{0, -20});
        buildingData.put("🛣️", new int[]{5, -5}); // Road has its own score
        buildingData.put("🚑", new int[]{0, -15});
        buildingData.put("🚰", new int[]{5, 15});
        buildingData.put("♻️", new int[]{5, 15});
        buildingData.put("🌬️", new int[]{10, 20});
        buildingData.put("⚠️", new int[]{25, -25});
        buildingData.put("🏘️", new int[]{10, 10});
        buildingData.put("🚨", new int[]{5, -20});
        buildingData.put("🏛️", new int[]{5, 10});
    }


    public GridPanel() {
        setLayout(new GridLayout(GRID_SIZE, GRID_SIZE));
        setBackground(Color.DARK_GRAY);
        this.currentScore = new GameScore(0, 0, 0); // Initialize score

        for (int r = 0; r < GRID_SIZE; r++) {
            for (int c = 0; c < GRID_SIZE; c++) {
                CellPanel cell = new CellPanel(r, c);
                cells[r][c] = cell;
                add(cell);
            }
        }

        // enable drag from side panel to here
        new DropTarget(this, DnDConstants.ACTION_COPY_OR_MOVE, new DropTargetAdapter() {
            @Override
            public void drop(DropTargetDropEvent dtde) {
                try {
                    dtde.acceptDrop(DnDConstants.ACTION_COPY);
                    String building = (String) dtde.getTransferable()
                            .getTransferData(DataFlavor.stringFlavor);

                    Point p = dtde.getLocation();
                    int cellWidth = getWidth() / GRID_SIZE;
                    int cellHeight = getHeight() / GRID_SIZE;
                    int col = p.x / cellWidth;
                    int row = p.y / cellHeight;

                    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
                        gridState[row][col] = building;
                        cells[row][col].setBuilding(building);

                        // Recalculate and notify
                        if (scoreListener != null) {
                            GameScore score = calculateScore();
                            scoreListener.accept(score);
                        }
                    }
                    dtde.dropComplete(true);
                } catch (Exception e) {
                    e.printStackTrace();
                    dtde.dropComplete(false);
                }
            }
        }, true);
    }

    public String[][] getGridState() {
        return gridState;
    }

    // Getter for the current score
    public GameScore getCurrentScore() {
        return currentScore;
    }

    // Updated listener setter
    public void setScoreListener(Consumer<GameScore> listener) {
        this.scoreListener = listener;
    }

    // Helper to check for adjacent (non-diagonal) roads
    private boolean hasRoadAccess(int r, int c, String[][] grid) {
        String roadEmoji = "🛣️";
        // Check North
        if (r > 0 && roadEmoji.equals(grid[r - 1][c])) return true;
        // Check South
        if (r < GRID_SIZE - 1 && roadEmoji.equals(grid[r + 1][c])) return true;
        // Check West
        if (c > 0 && roadEmoji.equals(grid[r][c - 1])) return true;
        // Check East
        if (c < GRID_SIZE - 1 && roadEmoji.equals(grid[r][c + 1])) return true;
        return false;
    }

    // New scoring logic
    private GameScore calculateScore() {
        double newEconomy = 0;
        double newSustainability = 0;

        for (int r = 0; r < GRID_SIZE; r++) {
            for (int c = 0; c < GRID_SIZE; c++) {
                String cell = gridState[r][c];
                if (cell != null && buildingData.containsKey(cell)) {
                    int[] values = buildingData.get(cell);

                    if (!"🛣️".equals(cell)) {
                        // It's a building. Check for road access.
                        if (hasRoadAccess(r, c, gridState)) {
                            newEconomy += values[0];
                            newSustainability += values[1];
                        }
                    } else {
                        // It's a road. Add its score directly.
                        newEconomy += values[0];
                        newSustainability += values[1];
                    }
                }
            }
        }

        // Omitted road penalty logic as it was ambiguous

        // Round + clamp to 0
        int economyScore = (int) Math.max(0, Math.round(newEconomy));
        int sustainabilityScore = (int) Math.max(0, Math.round(newSustainability));
        int totalScore = (economyScore + sustainabilityScore) / 2;

        this.currentScore = new GameScore(economyScore, sustainabilityScore, totalScore);
        return this.currentScore;
    }
}