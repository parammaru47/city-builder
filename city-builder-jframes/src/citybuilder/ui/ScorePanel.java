package citybuilder.ui;

import citybuilder.model.GameScore; // Import new model
import javax.swing.*;
import java.awt.*;

public class ScorePanel extends JPanel {
    private JLabel totalScoreLabel;
    private JLabel economyLabel;
    private JLabel sustainabilityLabel;
    private JProgressBar scoreBar;

    public ScorePanel() {
        setLayout(new BorderLayout(10, 10));
        setBackground(new Color(18, 18, 18));
        setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));

        // Panel for text labels
        JPanel labelPanel = new JPanel();
        labelPanel.setLayout(new FlowLayout(FlowLayout.LEFT, 20, 0));
        labelPanel.setOpaque(false);

        totalScoreLabel = new JLabel("Total Score: 0");
        totalScoreLabel.setForeground(Color.WHITE);
        totalScoreLabel.setFont(new Font("Poppins", Font.BOLD, 16));

        economyLabel = new JLabel("Economy: 0");
        economyLabel.setForeground(new Color(100, 180, 255)); // Blue-ish
        economyLabel.setFont(new Font("Poppins", Font.PLAIN, 14));

        sustainabilityLabel = new JLabel("Sustainability: 0");
        sustainabilityLabel.setForeground(new Color(76, 175, 80)); // Green
        sustainabilityLabel.setFont(new Font("Poppins", Font.PLAIN, 14));

        labelPanel.add(totalScoreLabel);
        labelPanel.add(economyLabel);
        labelPanel.add(sustainabilityLabel);

        // Progress bar for total score
        scoreBar = new JProgressBar(0, 100);
        scoreBar.setValue(0);
        scoreBar.setStringPainted(false);
        scoreBar.setPreferredSize(new Dimension(300, 20));
        scoreBar.setForeground(new Color(76, 175, 80)); // green
        scoreBar.setBackground(new Color(50, 50, 50));

        add(labelPanel, BorderLayout.NORTH);
        add(scoreBar, BorderLayout.CENTER);
    }

    // Updated method to accept GameScore
    public void updateScore(GameScore score) {
        totalScoreLabel.setText("Total Score: " + score.total());
        economyLabel.setText("Economy: " + score.economy());
        sustainabilityLabel.setText("Sustainability: " + score.sustainability());
        scoreBar.setValue(Math.min(score.total(), 100));
    }
}