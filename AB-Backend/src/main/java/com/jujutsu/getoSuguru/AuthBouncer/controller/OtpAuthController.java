package com.jujutsu.getoSuguru.AuthBouncer.controller;


import com.jujutsu.getoSuguru.AuthBouncer.Payload.EmailRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.JWTResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.OtpVerifyRequest;
import com.jujutsu.getoSuguru.AuthBouncer.service.OtpService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
public class OtpAuthController {

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenExpiration;

    private OtpService otpService;

    public OtpAuthController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody EmailRequest req) {
        String otp = otpService.generateAndSaveOtp(req.getEmail());
        otpService.sendOtp(req.getEmail(), otp);
        return ResponseEntity.ok("OTP sent to email.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> otpVerification(@RequestBody OtpVerifyRequest request, HttpServletResponse httpResponse) {
        String token = otpService.handleOtpVerification(request, httpResponse);
        if(Objects.equals(token, "Invalid OTP")) {
            return new ResponseEntity<>("Invalid OTP", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new JWTResponse(token, accessTokenExpiration), HttpStatus.OK);
    }
}
