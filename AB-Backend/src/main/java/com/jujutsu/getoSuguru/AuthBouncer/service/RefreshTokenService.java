package com.jujutsu.getoSuguru.AuthBouncer.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;
    private JWTService jwtService;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenDurationMs;

    public RefreshTokenService(RedisTemplate<String, String> redisTemplate, JWTService jwtService) {
        this.redisTemplate = redisTemplate;
        this.jwtService = jwtService;
    }

    private String key(String email) {
        return "refresh-token:" + email;
    }

    // called on login and on every refresh (rotation) — overwrites whatever was there
    public void storeToken(String email, String refreshToken) {
        redisTemplate.opsForValue().set(key(email), refreshToken, Duration.ofMillis(refreshTokenDurationMs));
    }

    // this is the real revocation check — not just "is the JWT signature valid"
    public boolean isActive(String refreshToken) {
        String email = jwtService.extractEmail(refreshToken);
        String stored = redisTemplate.opsForValue().get(key(email));
        return stored != null && stored.equals(refreshToken);
        // its a simple check weather the token is still in redis (means active or not)
    }

    // called on logout — this is what actually kills the session server-side
    public void invalidate(String email) {
        redisTemplate.delete(key(email));
        log.info("Invalidated refresh token for email: {}", email);
    }
}