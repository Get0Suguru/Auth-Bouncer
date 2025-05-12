package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.LoginRequest;
import com.jujutsu.getoSuguru.AuthBouncer.Payload.RegisterRequest;
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

    public AuthService(UserRepository userRepository, AuthenticationManager authManager, PasswordEncoder passwordEncoder, JWTService jwtService) {
        this.userRepository = userRepository;
        this.authManager = authManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    public String loginUser(LoginRequest loginRequest, HttpServletResponse httpResponse) throws InvalidLoginException {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if(user == null){
            throw new InvalidLoginException("Entered email isn't linked with any user's account");
        }

        try{
            authManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            // sending refresh token as httpOnly cookie
            String cookieValue = String.format(
                    "jwtToken=%s; Path=/; HttpOnly; Secure; SameSite=None",
                    refreshToken
            );
            httpResponse.addHeader("Set-Cookie", cookieValue);

            return accessToken;         // sending access token raw as response and expect frontend to handle and send in header
        }catch (Exception e){
            throw new InvalidLoginException( "Bad Credentials please recheck your credentials");
        }
    }

    public String refreshOldToken(String refreshToken, HttpServletResponse httpResponse) throws InvalidTokenException {
        try {
            if (jwtService.isTokenValid(refreshToken)) {
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
        return "failed";
    }

    public void logout(String refreshToken, HttpServletResponse httpResponse) {

        if(jwtService.isTokenValid(refreshToken)) {
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
