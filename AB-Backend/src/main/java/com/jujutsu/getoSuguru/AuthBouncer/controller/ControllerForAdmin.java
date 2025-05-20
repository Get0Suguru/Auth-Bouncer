package com.jujutsu.getoSuguru.AuthBouncer.controller;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/is-admin")
public class ControllerForAdmin {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test")
    public ResponseEntity<ApiResponse> isAdmin() {
        return new ResponseEntity<>(new ApiResponse("yes", true), HttpStatus.OK);
    }

    @GetMapping("/all-users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
        }
}
