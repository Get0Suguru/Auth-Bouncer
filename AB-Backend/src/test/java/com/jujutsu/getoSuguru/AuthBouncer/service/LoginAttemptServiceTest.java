package com.jujutsu.getoSuguru.AuthBouncer.service;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.mockito.Mockito;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;

import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class LoginAttemptServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valOps;

    @InjectMocks
    private LoginAttemptService loginAttemptService;

    @Test
    void isLocked_returnFalse_whenNoRecordExist(){

        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get(Mockito.anyString())).thenReturn(null);
        Assertions.assertFalse(loginAttemptService.isLocked("random@mail.com"));
    }

    @Test
    void isLocked_returnTrue_whenRecordExist(){

        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get(Mockito.anyString())).thenReturn("5");
        Assertions.assertTrue(loginAttemptService.isLocked("random@mail.com"));
    }


    @Test
    void recordLoginFailures_setsExpiry_onlyOnFirstFailure() {
       when(redisTemplate.opsForValue()).thenReturn(valOps);
       when(valOps.increment(Mockito.anyString())).thenReturn(1L);

       loginAttemptService.recordLoginFailures("test@mail.com");
       verify(redisTemplate, times(1)).expire("login_attempts:test@mail.com", Duration.ofMinutes(15));

    }

    @Test
    void recordLoginFailures_doesNotResetExpiry_onSecondFailure() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.increment("login_attempts:rest@gmail.com")).thenReturn(2L);

        loginAttemptService.recordLoginFailures("rest@gmail.com");
        loginAttemptService.recordLoginFailures("rest@gmail.com");

//        verify(valOps, times(2)).increment("rest@gmail.com");  // it'll check the number of times the method is called+ the argument passed (as per logs of mockito)
        verify(valOps, times(2)).increment("login_attempts:rest@gmail.com");  // it'll check the number of times the method is called+ the argument passed (as per logs of mockito)
        verify(redisTemplate, never()).expire(any(), any());
    }

    @Test
    void resetLoginAttempts_deletesKey(){

        loginAttemptService.resetLoginAttempts("test@mail.com");
        verify(redisTemplate, times(1)).delete(eq("login_attempts:test@mail.com"));
    }
}