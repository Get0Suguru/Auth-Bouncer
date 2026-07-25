package com.jujutsu.getoSuguru.AuthBouncer.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;


@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    // making redis key value tamplet
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${rate.limiting.max.requests:20}")
    private static int MAX_REQUESTS;

    private static final Duration DURATION = Duration.ofMinutes(1);

    public RateLimitingFilter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // we are guarding the unauthenticated urls
        boolean isUnauthenticatedPath = path.equals("/api/auth/login")
                || path.equals("/api/auth/request-otp")
                || path.equals("/api/auth/verify-otp");

        // if any auth path -> let is pass without rate limiting
        if(!isUnauthenticatedPath){
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = request.getRemoteAddr();

        String key = "rate_limiting:"+clientIp+"path:"+path;

        // if value wont exist for key -> it will create it with 0 + increment by 1 = 1
        Long currCount = redisTemplate.opsForValue().increment(key);

        // set expiry only on the first hit in this window, so the window is a true fixed window
        if(currCount != null && currCount == 1){
            redisTemplate.expire(key, DURATION);
            log.info("Rate limit set for {} && valid till {}", key, System.currentTimeMillis() + DURATION.toMillis());
        }
        log.info("Current count for {} is {}", key, currCount);

        if (currCount != null && currCount > MAX_REQUESTS) {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED); // 429
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Too many requests, please try again later\",\"success\":false}");
            return; // stop the chain here — request never reaches the controller
        }

        filterChain.doFilter(request, response);

    }
}

