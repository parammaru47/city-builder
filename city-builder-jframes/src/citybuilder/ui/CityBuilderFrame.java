package citybuilder.ui;

import javax.swing.*;
import java.awt.*;

public class CityBuilderFrame extends JFrame {

    private GridPanel gridPanel;
    private SidePanel sidePanel;
    private ScorePanel scorePanel;

    public CityBuilderFrame() {
        setTitle("City Builder");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        setBackground(new Color(18, 18, 18));

        gridPanel = new GridPanel();         // 8x8 grid
        sidePanel = new SidePanel();
        scorePanel = new ScorePanel();

        add(sidePanel, BorderLayout.WEST);
        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Map", gridPanel);

        // Pass gridPanel to SubmissionPanel constructor
        tabs.addTab("Submissions / High Scores", new SubmissionPanel(gridPanel));

        add(tabs, BorderLayout.CENTER);

        add(scorePanel, BorderLayout.SOUTH);

        setSize(1000, 800);
        setLocationRelativeTo(null);
        setVisible(true);

        // This link now works with the new GameScore object
        gridPanel.setScoreListener(scorePanel::updateScore);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(CityBuilderFrame::new);
    }
}