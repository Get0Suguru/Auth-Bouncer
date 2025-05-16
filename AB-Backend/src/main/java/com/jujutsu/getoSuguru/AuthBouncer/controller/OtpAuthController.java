package com.jujutsu.getoSuguru.AuthBouncer.controller;


import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.EmailRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.JWTResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.OtpVerifyRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidOtpException;
import com.jujutsu.getoSuguru.AuthBouncer.service.OtpService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<ApiResponse> requestOtp(@RequestBody EmailRequest req) throws InvalidLoginException {
        try{
            String otp = otpService.generateAndSaveOtp(req.getEmail());
            otpService.sendOtp(req.getEmail(), otp);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("OTP sent successfully", true));
        }catch (InvalidLoginException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> otpVerification(@RequestBody OtpVerifyRequest request, HttpServletResponse httpResponse) throws InvalidOtpException {

        try {
            String token = otpService.verifyOtpAndSendToken(request, httpResponse);
            return new ResponseEntity<>(new JWTResponse(token, accessTokenExpiration), HttpStatus.OK);
        }catch (InvalidOtpException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }
}
