package com.jujutsu.getoSuguru.AuthBouncer.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class LoginAttemptService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final Duration DURATION = Duration.ofMinutes(15);

    public LoginAttemptService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    private String makeKey(String key){
        return "login_attempts:"+key;
    }

    // recording login failures in our redis
    public void recordLoginFailures(String email){
        String key = makeKey(email);
        Long currCount = redisTemplate.opsForValue().increment(key);
        // only set expire if this is the first failure (to make a static timed window)
        if(currCount != null && currCount == 1){
            redisTemplate.expire(key, DURATION);
        }
    }

    // called on successful login
    public void resetLoginAttempts(String email){
        String key = makeKey(email);
        redisTemplate.delete(key);
    }

    // check if the user is locked
    public boolean isLocked(String email){
        String value = redisTemplate.opsForValue().get(makeKey(email));
        if(value == null) return false;
        return Integer.parseInt(value) >= MAX_LOGIN_ATTEMPTS;
    }

}
