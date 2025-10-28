package citybuilder.repository;

import citybuilder.model.Submission;
import citybuilder.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SubmissionRepository {

    // Removed local connection details

    // Removed private getConnection() method

    public void save(Submission submission) {
        String sql = "INSERT INTO submissions (user, grid_state, timestamp, economy_score, sustainability_score, score) VALUES (?, ?, ?, ?, ?, ?)";
        // Use DatabaseConnection.getConnection()
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, submission.getUser());
            stmt.setString(2, submission.getGridState());
            stmt.setTimestamp(3, submission.getTimestamp());
            stmt.setInt(4, submission.getEconomyScore());
            stmt.setInt(5, submission.getSustainabilityScore());
            stmt.setInt(6, submission.getScore());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Submission> findAll() {
        List<Submission> submissions = new ArrayList<>();
        String sql = "SELECT * FROM submissions ORDER BY timestamp DESC";

        // Use DatabaseConnection.getConnection()
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Submission s = new Submission(
                        rs.getLong("id"),
                        rs.getString("user"),
                        rs.getString("grid_state"),
                        rs.getTimestamp("timestamp"),
                        rs.getInt("economy_score"),
                        rs.getInt("sustainability_score"),
                        rs.getInt("score")
                );
                submissions.add(s);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return submissions;
    }

    public void deleteAll() {
        String sql = "DELETE FROM submissions";
        // Use DatabaseConnection.getConnection()
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.executeUpdate();
            System.out.println("✅ All submissions deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}