package com.citybuilder.citybuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String user;

    @Column(columnDefinition = "json")
    private String gridState;   // Store grid as JSON string

    private int economyScore;
    private int sustainabilityScore;
    private int score;

    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getGridState() { return gridState; }
    public void setGridState(String gridState) { this.gridState = gridState; }

    public int getEconomyScore() { return economyScore; }
    public void setEconomyScore(int economyScore) { this.economyScore = economyScore; }

    public int getSustainabilityScore() { return sustainabilityScore; }
    public void setSustainabilityScore(int sustainabilityScore) { this.sustainabilityScore = sustainabilityScore; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
