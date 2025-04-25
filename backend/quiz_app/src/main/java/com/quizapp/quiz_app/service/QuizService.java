package com.quizapp.quiz_app.service;

import com.quizapp.quiz_app.model.Category;
import com.quizapp.quiz_app.model.Admin;
import com.quizapp.quiz_app.model.Question;
import com.quizapp.quiz_app.repository.AdminRepository;
import com.quizapp.quiz_app.repository.CategoryRepository;
import com.quizapp.quiz_app.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AdminRepository adminRepository;

    // Category Operations
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Question Operations
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getRandomQuestionsByCategory(Long categoryId, int limit) {
        return questionRepository.findRandomQuestionsByCategory(categoryId, limit);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Admin Operations
    public Admin createInitialAdmin(String username, String password) {
        // Check if admin already exists
        if (adminRepository.existsByUsername(username)) {
            throw new RuntimeException("Admin already exists");
        }

        // Create new admin
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(password);

        return adminRepository.save(admin);
    }
    
    public boolean adminLogin(String username, String password) {
        // Find admin by username
        Admin admin = adminRepository.findByUsername(username);

        // Check if admin exists and password matches
        // NOTE: In a real app, use password encoding!
        return admin != null && admin.getPassword().equals(password);
    }
}