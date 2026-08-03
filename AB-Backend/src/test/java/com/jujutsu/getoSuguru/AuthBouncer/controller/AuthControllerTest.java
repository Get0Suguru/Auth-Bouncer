package com.jujutsu.getoSuguru.AuthBouncer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.LoginRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.RegisterRequest;
import com.jujutsu.getoSuguru.AuthBouncer.config.SecurityConfig;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.AccountLockedException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidTokenException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.RegistrationException;
import com.jujutsu.getoSuguru.AuthBouncer.service.AuthService;
import com.jujutsu.getoSuguru.AuthBouncer.service.CustomUserDetailService;
import com.jujutsu.getoSuguru.AuthBouncer.service.JWTService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    // as partially the http/web side of spring context loads so u can actually bean inject

    // Reads as: "Spring, you built the web layer — give me the tool that lets me fire fake HTTP requests at it
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private AuthService authService;
    @MockitoBean private JWTService jwtService;
    @MockitoBean private CustomUserDetailService customUserDetailService;
    @MockitoBean private RedisTemplate<String, String> redisTemplate;

    private ValueOperations<String, String> valOps;

    @BeforeEach
    void setUp() {
        valOps = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.increment(anyString())).thenReturn(1L); // simulate first request in the window
    }

    @Test
    void login_return400_atBadPassword() throws Exception {
        when(authService.loginUser(any(), any())).thenThrow(new InvalidLoginException("Bad Cred Plz recheck then Creds"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest())))
                .andExpect(status().isBadRequest());
    }
    @Test
    void login_returns423_whenLocked() throws Exception {
        when(authService.loginUser(any(), any()))
                .thenThrow(new AccountLockedException("Too many failed attempts. Please try again in 15 minutes"));

        LoginRequest req = new LoginRequest();
        req.setEmail("r@mail.com");
        req.setPassword("wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isLocked());
    }

    @Test
    void register_returns400_onDuplicateEmail() throws Exception {
        doThrow(new RegistrationException("This email is already linked to another User"))
                .when(authService).registerUser(any());

        RegisterRequest req = new RegisterRequest("taken@mail.com", "user1", "pass123", "pass123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void refresh_returns400_onInvalidToken() throws Exception {
        when(authService.refreshOldToken(any(), any()))
                .thenThrow(new InvalidTokenException("Token is not valid or expired"));

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie("jwtToken", "garbage-token")))
                .andExpect(status().isBadRequest());
    }
}
