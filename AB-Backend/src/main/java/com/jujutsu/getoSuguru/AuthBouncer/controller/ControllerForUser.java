package com.jujutsu.getoSuguru.AuthBouncer.controller;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/is-user")
public class ControllerForUser {

    @GetMapping("/test")
    public ResponseEntity<ApiResponse> isUser() {
        return new ResponseEntity<>(new ApiResponse("yes", true), HttpStatus.OK);
    }
}
