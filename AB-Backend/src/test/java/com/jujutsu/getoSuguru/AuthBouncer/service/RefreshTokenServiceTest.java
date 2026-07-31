package com.jujutsu.getoSuguru.AuthBouncer.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {


    @InjectMocks
    private RefreshTokenService refreshTokenService;

    @BeforeEach
    void setUp(){
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenDurationMs", 3600000L);
    }

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valOps;

    @Test
    void storeToken_savesWithCorrectKeyAndDuration() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        refreshTokenService.storeToken("r@r.com", "r");
        verify(valOps).set(eq("refresh-token:r@r.com"), eq("r"), eq(Duration.ofMillis(3600000L)));
    }

    @Test
    void isActive_returnsTrue_whenStoredTokenMatches() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get("refresh-token:r@mail.com")).thenReturn("some-token");

        assertTrue(refreshTokenService.isActive("r@mail.com", "some-token"));
    }

    @Test
    void isActive_returnsFalse_whenStoredTokenDiffers() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get("refresh-token:r@mail.com")).thenReturn("old-token");

        assertFalse(refreshTokenService.isActive("r@mail.com", "some-token"));
    }

    @Test
    void isActive_returnsFalse_whenNothingStored() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get("refresh-token:r@mail.com")).thenReturn(null);

        assertFalse(refreshTokenService.isActive("r@mail.com", "some-token"));
    }

    @Test
    void invalidate_deletesCorrectKey() {
        refreshTokenService.invalidate("r@mail.com");

        verify(redisTemplate).delete("refresh-token:r@mail.com");
    }

}