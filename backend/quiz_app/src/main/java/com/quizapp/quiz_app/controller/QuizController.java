package com.quizapp.quiz_app.controller;

import com.quizapp.quiz_app.model.Category;
import com.quizapp.quiz_app.model.Question;
import com.quizapp.quiz_app.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*") // Allow all origins
public class QuizController {
    @Autowired
    private QuizService quizService;

    // Category Endpoints
    @PostMapping("/category")
    public Category createCategory(@RequestBody Category category) {
        return quizService.createCategory(category);
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return quizService.getAllCategories();
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return quizService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Question Endpoints
    @PostMapping("/question")
    public Question createQuestion(@RequestBody Question question) {
        return quizService.createQuestion(question);
    }

    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return quizService.getAllQuestions();
    }

    @GetMapping("/random-questions/{categoryId}")
    public List<Question> getRandomQuestions(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "5") int limit) {
        return quizService.getRandomQuestionsByCategory(categoryId, limit);
    }
}