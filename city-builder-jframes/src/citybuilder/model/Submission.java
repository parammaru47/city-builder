package citybuilder.model;

import java.sql.Timestamp;

public class Submission {
    private long id;
    private String user;
    private String gridState;
    private Timestamp timestamp;
    private int economyScore;
    private int sustainabilityScore;
    private int score;

    public Submission() {}

    public Submission(long id, String user, String gridState,
                      Timestamp timestamp, int economyScore, int sustainabilityScore, int score) {
        this.id = id;
        this.user = user;
        this.gridState = gridState;
        this.timestamp = timestamp;
        this.economyScore = economyScore;
        this.sustainabilityScore = sustainabilityScore;
        this.score = score;
    }

    // Getters and setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getGridState() { return gridState; }
    public void setGridState(String gridState) { this.gridState = gridState; }

    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }

    public int getEconomyScore() { return economyScore; }
    public void setEconomyScore(int economyScore) { this.economyScore = economyScore; }

    public int getSustainabilityScore() { return sustainabilityScore; }
    public void setSustainabilityScore(int sustainabilityScore) { this.sustainabilityScore = sustainabilityScore; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
