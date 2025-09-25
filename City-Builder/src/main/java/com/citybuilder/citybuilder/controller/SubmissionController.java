package com.citybuilder.citybuilder.controller;

import com.citybuilder.citybuilder.model.Submission;
import com.citybuilder.citybuilder.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    // Create new submission
    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        return submissionRepository.save(submission);
    }

    // Get all submissions
    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    // Get top 10 by score
    @GetMapping("/highscores")
    public List<Submission> getHighScores() {
        return submissionRepository.findTop10ByOrderByScoreDesc();
    }
}
