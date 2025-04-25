package com.quizapp.quiz_app.controller;

import com.quizapp.quiz_app.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminLoginController {
    @Autowired
    private QuizService quizService;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(
            @RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();
        try {
            boolean loginSuccess = quizService.adminLogin(username, password);
            response.put("success", loginSuccess);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed");
            return ResponseEntity.status(401).body(response);
        }
    }
}