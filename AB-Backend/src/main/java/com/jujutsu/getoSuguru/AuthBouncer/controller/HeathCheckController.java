package com.jujutsu.getoSuguru.AuthBouncer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HeathCheckController {

    @GetMapping("/test")
    public String test() {
        return "things are working ";
    }

}
