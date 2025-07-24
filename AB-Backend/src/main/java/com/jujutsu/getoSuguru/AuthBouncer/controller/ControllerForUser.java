package com.jujutsu.getoSuguru.AuthBouncer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/for-user")
public class ControllerForUser {

    @GetMapping("/test")
    public String isUser() {
        return "only a user can see this";
    }
}
