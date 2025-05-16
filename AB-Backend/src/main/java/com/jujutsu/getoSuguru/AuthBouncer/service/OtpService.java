package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.OtpVerifyRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidOtpException;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
public class OtpService {
    private final RedisTemplate<String, String> redisTemplate;
    private UserRepository userRepo;
    private JavaMailSender mailSender;
    private JWTService jwtService;

    public OtpService(RedisTemplate<String, String> redisTemplate, UserRepository userRepo, JavaMailSender mailSender, JWTService jwtService) {
        this.redisTemplate = redisTemplate;
        this.userRepo = userRepo;
        this.mailSender = mailSender;
        this.jwtService = jwtService;
    }

    public String generateAndSaveOtp(String email) throws InvalidLoginException {

        if(userRepo.existsByEmail(email)) {
            String otp = String.valueOf(new Random().nextInt(890000) + 100000);
            redisTemplate.opsForValue().set("OTP:" + email, otp, Duration.ofMinutes(5));            // to set value in redis
            return otp;
        }else {
            throw new InvalidLoginException("User not found with entered email");
        }
    }

    public boolean verifyOtp(String email, String otp){
        String storedOtp = redisTemplate.opsForValue().get("OTP:" + email);                             // to get value from redis
        return storedOtp != null && storedOtp.equals(otp);
    }

    public void sendOtp(String toEmail, String otp){
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("OTP Verification");
        msg.setText("Your OTP is: " + otp + " and will expire in 5 minutes");
        mailSender.send(msg);
    }

    public String verifyOtpAndSendToken(OtpVerifyRequest request, HttpServletResponse httpResponse) throws InvalidOtpException {
            if (!verifyOtp(request.getEmail(), request.getOtp())) {
                throw new InvalidOtpException("Invalid! OTP, please recheck");
            }

            User user = userRepo.findByEmail(request.getEmail());
            String token = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            String cookieValue = String.format(
                    "jwtToken=%s; Path=/; HttpOnly; Secure; SameSite=None",
                    refreshToken
            );
            httpResponse.addHeader("Set-Cookie", cookieValue);
            return token;
    }
}
