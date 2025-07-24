package com.jujutsu.getoSuguru.AuthBouncer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/for-admin")
public class ControllerForAdmin {

    @GetMapping("/test")
    public String isAdmin() {
        return "this is for admin";
    }
}
