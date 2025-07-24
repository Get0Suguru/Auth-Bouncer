package com.jujutsu.getoSuguru.AuthBouncer.controller;


import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.model.Role;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import com.jujutsu.getoSuguru.AuthBouncer.service.CustomUserDetailService;
import com.jujutsu.getoSuguru.AuthBouncer.service.GoogleAuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth/google")                             // this controller is to get the auth token from frontend
public class GoogleAuthController {


    @Autowired
    private GoogleAuthService googleAuthService;

    @GetMapping("/test")
    public String test() {
        return "things are working ";
    }

    // saar -> we gonna hit 2 api's (# 1st to get the access token from code ||  # 2nd to get the user info using that token)
    @GetMapping("/callback")
    public ResponseEntity<ApiResponse> handleGoogleCallback(@RequestParam String code, HttpServletResponse httpResponse) {
        String accessToken =googleAuthService.getAccessTokenUsingCode(code, httpResponse);
        return new ResponseEntity<>(new ApiResponse(accessToken, true), HttpStatus.OK);
    }
}
