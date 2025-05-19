package com.jujutsu.getoSuguru.AuthBouncer.controller;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.ApiResponse;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.ChangePasswordRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidOtpException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidRequestException;
import com.jujutsu.getoSuguru.AuthBouncer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/modify-user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> changePassword() throws InvalidLoginException {
        try{
            userService.findUserAndSendOtp();
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Otp sent successfully", true));
        }catch (InvalidLoginException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody ChangePasswordRequest request) throws InvalidOtpException {
        try{
            userService.verifyOtpAndChangePassword(request);
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Password changed successfully", true));
        }catch (InvalidOtpException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/make-admin")
    public ResponseEntity<ApiResponse> makeAdmin() {
        try {
            userService.makeAdmin();
            return new ResponseEntity<>(new ApiResponse("Admin created successfully", true), HttpStatus.CREATED);

        } catch (InvalidRequestException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.BAD_REQUEST);
        }
    }

}
