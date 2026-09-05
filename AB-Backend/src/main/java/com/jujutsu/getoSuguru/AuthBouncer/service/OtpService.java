package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.OtpVerifyRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidOtpException;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {
    private final RedisTemplate<String, String> redisTemplate;
    private UserRepository userRepo;
    private RestTemplate restTemplate;
    private JWTService jwtService;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name:Auth-Bouncer}")
    private String senderName;

    private static final String BREVO_SEND_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

    public OtpService(RedisTemplate<String, String> redisTemplate, UserRepository userRepo, RestTemplate restTemplate, JWTService jwtService) {
        this.redisTemplate = redisTemplate;
        this.userRepo = userRepo;
        this.restTemplate = restTemplate;
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
        // Render's free tier blocks all outbound SMTP ports (25/465/587),
        // so email is sent over Brevo's HTTPS API (port 443) instead of raw SMTP.
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> sender = new HashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);

        Map<String, Object> recipient = new HashMap<>();
        recipient.put("email", toEmail);

        Map<String, Object> body = new HashMap<>();
        body.put("sender", sender);
        body.put("to", List.of(recipient));
        body.put("subject", "OTP Verification");
        body.put("textContent", "Your OTP is: " + otp + " and will expire in 5 minutes");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(BREVO_SEND_EMAIL_URL, request, String.class);
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