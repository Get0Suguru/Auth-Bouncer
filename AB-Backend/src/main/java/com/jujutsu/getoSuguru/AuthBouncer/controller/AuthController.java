package com.jujutsu.getoSuguru.AuthBouncer.controller;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.JWTResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.LoginRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.RegisterRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidTokenException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.RegistrationException;
import com.jujutsu.getoSuguru.AuthBouncer.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenExpiration;



    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest registerRequest) throws Exception {

        try{
            authService.registerUser(registerRequest);
            return new ResponseEntity<>(new ApiResponse("Registration successful" , true), HttpStatus.CREATED);
        }catch (RegistrationException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpResponse) throws InvalidLoginException {

       try{
           String accessToken =authService.loginUser(loginRequest, httpResponse);
           return new ResponseEntity<>(new JWTResponse(accessToken, accessTokenExpiration), HttpStatus.OK);
       } catch (InvalidLoginException e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
       }

    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue("jwtToken") String refreshToken, HttpServletResponse httpResponse) {
        try {
            String accessToken = authService.refreshOldToken(refreshToken, httpResponse);
            return new ResponseEntity<>(new JWTResponse(accessToken, accessTokenExpiration), HttpStatus.OK);
        } catch (InvalidTokenException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/logout")                     //access token will be killed by frontend u kill the refresh token
    public ResponseEntity<ApiResponse> logout(@CookieValue("jwtToken") String refreshToken, HttpServletResponse httpResponse){
        authService.logout(refreshToken, httpResponse);
        return new ResponseEntity<>(new ApiResponse("Logout successful" , true), HttpStatus.OK);
    }


}
