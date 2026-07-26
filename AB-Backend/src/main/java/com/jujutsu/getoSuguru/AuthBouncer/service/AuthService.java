package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.LoginRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.RegisterRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.AccountLockedException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidTokenException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.RegistrationException;
import com.jujutsu.getoSuguru.AuthBouncer.model.AuthProvider;
import com.jujutsu.getoSuguru.AuthBouncer.model.Role;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


    private UserRepository userRepository;
    private AuthenticationManager authManager;
    private PasswordEncoder passwordEncoder;            // ab ye spring ke ioc ka part (after @Bean) so it will manage for me
    private JWTService jwtService;
    private LoginAttemptService loginAttemptService;
    private RefreshTokenService refreshTokenService;

    public AuthService(RefreshTokenService refreshTokenService, UserRepository userRepository, AuthenticationManager authManager, PasswordEncoder passwordEncoder, JWTService jwtService, LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.authManager = authManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
        this.refreshTokenService = refreshTokenService;
    }

    public void registerUser(RegisterRequest registerRequest) throws RegistrationException {

        if(!(registerRequest.getPassword().equals(registerRequest.getConfirmPassword()))) {
            throw new RegistrationException("Password and Confirm Password doesn't match");
        }

        if(userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RegistrationException("Username is taken by another user");
        }
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RegistrationException("This email is already linked to another User");
        }

        String HashedPassword = passwordEncoder.encode(registerRequest.getPassword());

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(HashedPassword);

        user.setRole(Role.ROLE_USER);                                      //if value exist from list of enum
        user.setProvider(AuthProvider.LOCAL);            //if value don't exist from list of enum
        user.setIsVerified(false);

        userRepository.save(user);



    }

    public String loginUser(LoginRequest loginRequest, HttpServletResponse httpResponse) throws InvalidLoginException, AccountLockedException {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if(user == null){
            throw new InvalidLoginException("Entered email isn't linked with any user's account");
        }

        // check the lock BEFORE we even try authenticating
        if(loginAttemptService.isLocked(loginRequest.getEmail())){
            throw new AccountLockedException("Too many failed attempts. Please try again in 15 minutes");
        }


        try{
            authManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            String cookieValue = String.format(
                    "jwtToken=%s; Path=/; HttpOnly; Secure; SameSite=None",
                    refreshToken
            );
            httpResponse.addHeader("Set-Cookie", cookieValue);

            loginAttemptService.resetLoginAttempts(loginRequest.getEmail()); // success wipes the counter

            return accessToken;
        }catch (Exception e){
            loginAttemptService.recordLoginFailures(loginRequest.getEmail()); // failure increments it
            throw new InvalidLoginException( "Bad Credentials please recheck your credentials");
        }
    }

    public String refreshOldToken(String refreshToken, HttpServletResponse httpResponse) throws InvalidTokenException {
        try {
            //  i feel here should be just redis check the 2nd one -> the first one checks the claims(variable in token) + signature + db check
            if (jwtService.isTokenValid(refreshToken) && refreshTokenService.isActive(refreshToken)) {
                String accessToken = jwtService.generateAccessToken(userRepository.findByEmail(jwtService.extractEmail(refreshToken)));
                String newRefreshToken = jwtService.generateRefreshToken(userRepository.findByEmail(jwtService.extractEmail(refreshToken)));

                String cookieValue = String.format(
                        "jwtToken=%s; Path=/; HttpOnly; Secure; SameSite=None",
                        newRefreshToken
                );
                httpResponse.addHeader("Set-Cookie", cookieValue);
                return accessToken;
            }
        }
        catch (Exception e) {
            throw new InvalidTokenException("Token is not valid or expired");
        }
        return "failed to convert refresh token (must be invalid or expired)";
    }

    public void logout(String refreshToken, HttpServletResponse httpResponse) {

        if(jwtService.isTokenValid(refreshToken)) {
            String email = jwtService.extractEmail(refreshToken);
            refreshTokenService.invalidate(email);

            Cookie cookie = new Cookie("jwtToken", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            cookie.setSecure(true);
            cookie.setHttpOnly(true);
            httpResponse.addCookie(cookie);
            SecurityContextHolder.clearContext();
        }
    }
}
