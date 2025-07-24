package com.jujutsu.getoSuguru.AuthBouncer.controller;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.LoginRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.RegisterRequest;
import com.jujutsu.getoSuguru.AuthBouncer.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;



    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest registerRequest) {

        authService.registerUser(registerRequest);
        return new ResponseEntity<>(new ApiResponse("Login successful" , true), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpResponse){
        String accessToken =authService.verifyUser(loginRequest, httpResponse);
        return new ResponseEntity<>(new ApiResponse(accessToken, true), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refresh(@CookieValue("jwtToken") String refreshToken, HttpServletResponse httpResponse){
        String accessToken = authService.refreshOldToken(refreshToken, httpResponse);
        return new ResponseEntity<>(new ApiResponse(accessToken, true), HttpStatus.OK);

    }


}
