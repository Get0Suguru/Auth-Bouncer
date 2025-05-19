package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.ChangePasswordRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidOtpException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidRequestException;
import com.jujutsu.getoSuguru.AuthBouncer.model.Role;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
public class UserService {

    private RedisTemplate<String, String> redisTemplate;
    private UserRepository userRepo;
    private OtpService otpService;
    private PasswordEncoder passwordEncoder;
    private CustomUserDetailService userDetailService;

    public UserService(RedisTemplate<String, String> redisTemplate, UserRepository userRepo, OtpService otpService, PasswordEncoder passwordEncoder, CustomUserDetailService userDetailService) {
        this.redisTemplate = redisTemplate;
        this.userRepo = userRepo;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.userDetailService = userDetailService;
    }

    public void findUserAndSendOtp() throws InvalidLoginException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();

            if (authentication.isAuthenticated()) {
                String email = ((UserDetails) principal).getUsername();
                String otp = String.valueOf(new Random().nextInt(890000) + 100000);
                otpService.sendOtp(email, otp);
                redisTemplate.opsForValue().set("OTP:" + email, otp, Duration.ofMinutes(5));
            }
        } catch (Exception e){
            throw new InvalidLoginException("Invalid login credentials");
        }
    }

    public void verifyOtpAndChangePassword(ChangePasswordRequest changePasswordRequest) throws InvalidOtpException {
        String otp = changePasswordRequest.getOtp();
        String newPassword = changePasswordRequest.getNewPassword();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.isAuthenticated()) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            if (otpService.verifyOtp(email, otp)) {
                User user = userRepo.findByEmail(email);
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepo.save(user);
            } else {
                throw new InvalidOtpException("Invalid OTP");
            }
        }
    }

    public void makeAdmin() throws InvalidRequestException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String email = ((UserDetails)principal).getUsername();

        if(authentication.isAuthenticated()) {
            User user = userRepo.findByEmail(email);
            if(user.getRole() == Role.ROLE_ADMIN) {
                throw new InvalidRequestException("You are already an admin");
            }
            user.setRole(Role.ROLE_ADMIN);
            userRepo.save(user);
        }
        UserDetails userDetailsObj = userDetailService.loadUserByUsername(email);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userDetailsObj, null, userDetailsObj.getAuthorities()));
//        so we updated the role in the db & now we have to update the security context holder
    }
}
