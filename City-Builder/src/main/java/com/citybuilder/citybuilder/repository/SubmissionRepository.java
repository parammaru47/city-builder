package com.citybuilder.citybuilder.repository;

import com.citybuilder.citybuilder.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findTop10ByOrderByScoreDesc();
}
