package citybuilder.ui;

import javax.swing.*;
import java.awt.*;

public class CellPanel extends JPanel {
    private String building = "";
    private final int row, col;

    public CellPanel(int row, int col) {
        this.row = row;
        this.col = col;
        setBorder(BorderFactory.createLineBorder(Color.GRAY));
        setBackground(new Color(30, 30, 30));
    }

    public void setBuilding(String b) {
        this.building = b;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        if (!building.isEmpty()) {
            g.setFont(new Font("SansSerif", Font.BOLD, 24));
            g.drawString(building, getWidth() / 2 - 10, getHeight() / 2 + 10);
        }
    }
}
