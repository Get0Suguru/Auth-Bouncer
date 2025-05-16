package com.jujutsu.getoSuguru.AuthBouncer.controller;


import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.JWTResponse;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.GithHubAuthException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.GoogleOAuthException;
import com.jujutsu.getoSuguru.AuthBouncer.service.GithubOAuthService;
import com.jujutsu.getoSuguru.AuthBouncer.service.GoogleOAuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")                             // this controller is to get the auth token from frontend
public class OAuthController {

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenDurationMs;

    private GoogleOAuthService googleOAuthService;
    private GithubOAuthService githHubOAuthService;

    public OAuthController(GoogleOAuthService googleOAuthService, GithubOAuthService githubOAuthService) {
        this.googleOAuthService = googleOAuthService;
        this.githHubOAuthService = githubOAuthService;
    }

    // saar -> we gonna hit 2 api's (# 1st to get the access token from code ||  # 2nd to get the user info using that token)

// Google OAuth2  (asking for authentication code)
    @PostMapping("/google/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam String code, HttpServletResponse httpResponse) {
        try {
            String accessToken = googleOAuthService.getAccessTokenUsingCode(code, httpResponse);
            return new ResponseEntity<>(new JWTResponse(accessToken, accessTokenDurationMs), HttpStatus.CREATED);
        }catch (GoogleOAuthException e){
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.BAD_REQUEST);
        }
    }

//    GitHub OAuth2 (asking for authentication code)
    @PostMapping("/github/callback")
    public ResponseEntity<?> handleGithubCallback(@RequestParam String code, HttpServletResponse httpResponse) {
        try {
            String accessToken = githHubOAuthService.getAccessTokenUsingCode(code, httpResponse);
            return new ResponseEntity<>(new JWTResponse(accessToken, accessTokenDurationMs), HttpStatus.CREATED);
        } catch (GithHubAuthException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.BAD_REQUEST);
        }
    }
}
