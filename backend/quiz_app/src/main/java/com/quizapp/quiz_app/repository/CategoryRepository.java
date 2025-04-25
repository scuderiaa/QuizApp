package com.quizapp.quiz_app.repository;

import com.quizapp.quiz_app.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);

    // Category findByImageUrl(String imageUrl);
}