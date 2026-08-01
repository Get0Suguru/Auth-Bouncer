package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.LoginRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.AccountLockedException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;

import javax.naming.AuthenticationException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private HttpServletResponse httpServletResponse;
    @Mock private LoginAttemptService loginAttemptService;
    @Mock private AuthenticationManager authManager;
    @Mock private JWTService jwtService;

    @InjectMocks
    private AuthService authService;

    private LoginRequest bare;

    @BeforeEach
    void setUp() {
        bare = new LoginRequest();
        bare.setEmail("b@mail.com");
        bare.setPassword("password");
    }

    @Test
    void loginUser_throwsInvalidLogin_whenUserNotFound() throws AccountLockedException, InvalidLoginException {

        when(userRepo.findByEmail(any())).thenReturn(null);
        assertThrows(InvalidLoginException.class, () -> authService.loginUser(bare, httpServletResponse));
        verifyNoInteractions(authManager, loginAttemptService);
    }

    @Test
    void loginUser_throwsAccountLocked_whenLocked() throws AccountLockedException, InvalidLoginException {

//        might it return non null entity on its own ?
        when(userRepo.findByEmail(any())).thenReturn(new User());

        when(loginAttemptService.isLocked(bare.getEmail())).thenReturn(true);
        assertThrows(AccountLockedException.class, () -> authService.loginUser(bare, httpServletResponse));

        verifyNoInteractions(authManager);
    }

    @Test
    void loginUser_throwsInvalidLogin_andRecordsFailure_onBadPassword() {

        when(userRepo.findByEmail(any())).thenReturn(new User());
        when(loginAttemptService.isLocked(bare.getEmail())).thenReturn(false);

        when(authManager.authenticate(any())).thenThrow(new BadCredentialsException("bad"));

        assertThrows(InvalidLoginException.class, () -> authService.loginUser(bare, httpServletResponse));
        verify(loginAttemptService, times(1)).recordLoginFailures(bare.getEmail());
    }

    @Test
    void loginUser_returnsToken_andResetsAttempts_onSuccess() throws Exception {
        User user = new User();
        user.setEmail("b@mail.com");
        when(userRepo.findByEmail("b@mail.com")).thenReturn(user);
        when(loginAttemptService.isLocked("b@mail.com")).thenReturn(false);
        when(authManager.authenticate(any())).thenReturn(null); // succeeds without throwing
        when(jwtService.generateAccessToken(user)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh-token");

        String result = authService.loginUser(bare, httpServletResponse);

        assertEquals("access-token", result);
        verify(loginAttemptService).resetLoginAttempts("b@mail.com");
        verify(loginAttemptService, never()).recordLoginFailures(anyString());
        verify(httpServletResponse).addHeader(eq("Set-Cookie"), contains("refresh-token"));
    }
}