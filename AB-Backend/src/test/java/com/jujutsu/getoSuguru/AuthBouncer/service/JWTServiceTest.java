package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.model.Role;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JWTServiceTest {

    @InjectMocks
    private JWTService jwtService;

    User bareMinUser;

    @BeforeEach
    public void setup(){
        ReflectionTestUtils.setField(jwtService, "jwtSecret", "a-fake-secret-key-thats-long-enough-for-hmac-256");
        ReflectionTestUtils.setField(jwtService, "accessTokenDurationMs", 9000L);
        ReflectionTestUtils.setField(jwtService, "refreshTokenDurationMs", 900000L);

        bareMinUser = new User();
        bareMinUser.setEmail("bare@mail.com");
        bareMinUser.setRole(Role.ROLE_USER);
    }

    @Test
    public void generateAccessToken_shouldGenerateToken(){

        assertNotNull(jwtService.generateAccessToken(bareMinUser));
    }

    @Mock
    private RefreshTokenService refreshTokenService;


    @Test
    public void generateRefreshToken_shouldGenerateToken(){

        // mocking doesn't mean null -> common misconception of mine
        // i don't even need to do when then
        // mocking makes the object of RefreshTokenService (its a shell empty != null at all)
        // no empty shell .store  won't throw NPE  -> tho as we aren't stubbing that method it'll run -> return type void
        // so i can skip thinking about it

        assertNotNull(jwtService.generateRefreshToken(bareMinUser));
        verify(refreshTokenService, times(1)).storeToken(any(), any());
    }

    @Mock
    private UserRepository userRepo;

    @Test
    void isTokenValid_returnsFalse_whenUserDoesNotExist() {
        String token = jwtService.generateAccessToken(bareMinUser);
        when(userRepo.existsByEmail("bare@mail.com")).thenReturn(false);

        assertFalse(jwtService.isTokenValid(token));
    }

    @Test
    void isTokenValid_returnsTrue_whenUserExistsAndNotExpired() {
        String token = jwtService.generateAccessToken(bareMinUser);
        when(userRepo.existsByEmail("bare@mail.com")).thenReturn(true);

        assertTrue(jwtService.isTokenValid(token));
    }

}