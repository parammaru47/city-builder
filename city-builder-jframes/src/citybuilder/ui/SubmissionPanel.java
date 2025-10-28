package citybuilder.ui;

import citybuilder.model.GameScore; // Import new model
import citybuilder.model.Submission;
import citybuilder.repository.SubmissionRepository;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

public class SubmissionPanel extends JPanel {
    private SubmissionRepository repository;
    private DefaultListModel<String> listModel;
    private GridPanel gridPanel; // Reference to GridPanel

    // Constructor now accepts GridPanel
    public SubmissionPanel(GridPanel gridPanel) {
        this.gridPanel = gridPanel; // Assign reference
        this.repository = new SubmissionRepository();
        this.listModel = new DefaultListModel<>();

        setLayout(new BorderLayout());

        // UI Elements
        JTextField userField = new JTextField(10);
        // JTextArea gridStateArea = new JTextArea(3, 20); // Removed, redundant
        JButton submitButton = new JButton("Submit");
        JButton refreshButton = new JButton("Refresh");
        JButton deleteButton = new JButton("Delete All");

        // Top panel for input
        JPanel inputPanel = new JPanel();
        inputPanel.add(new JLabel("User:"));
        inputPanel.add(userField);
        // inputPanel.add(new JLabel("Grid JSON:")); // Removed
        // inputPanel.add(new JScrollPane(gridStateArea)); // Removed
        inputPanel.add(submitButton);
        inputPanel.add(refreshButton);
        inputPanel.add(deleteButton);

        add(inputPanel, BorderLayout.NORTH);
        add(new JScrollPane(new JList<>(listModel)), BorderLayout.CENTER);

        // Button Actions
        submitButton.addActionListener((ActionEvent e) -> {
            String user = userField.getText();

            // Get grid state from the GridPanel reference
            String[][] grid = gridPanel.getGridState();

            // Build JSON
            StringBuilder jsonBuilder = new StringBuilder("[");
            for (int r = 0; r < grid.length; r++) {
                jsonBuilder.append("[");
                for (int c = 0; c < grid[r].length; c++) {
                    String val = grid[r][c] == null ? "" : grid[r][c];
                    jsonBuilder.append("\"").append(val).append("\"");
                    if (c < grid[r].length - 1) jsonBuilder.append(",");
                }
                jsonBuilder.append("]");
                if (r < grid.length - 1) jsonBuilder.append(",");
            }
            jsonBuilder.append("]");
            String gridState = jsonBuilder.toString();

            // Get real scores from GridPanel
            GameScore score = gridPanel.getCurrentScore();

            // Create submission object
            Submission submission = new Submission(
                    0, // id auto-increment
                    user,
                    gridState,
                    Timestamp.valueOf(LocalDateTime.now()),
                    score.economy(), // Real score
                    score.sustainability(), // Real score
                    score.total() // Real score
            );

            repository.save(submission);
            refresh();
        });

        refreshButton.addActionListener(e -> refresh());

        deleteButton.addActionListener(e -> {
            repository.deleteAll();
            refresh();
        });

        refresh();
    }

    private void refresh() {
        listModel.clear();
        List<Submission> submissions = repository.findAll();
        for (Submission s : submissions) {
            listModel.addElement(
                    s.getUser() + " | Score: " + s.getScore() +
                            " | Economy: " + s.getEconomyScore() +
                            " | Sustainability: " + s.getSustainabilityScore() +
                            " | " + s.getTimestamp()
            );
        }
    }
}