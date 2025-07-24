package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.model.Role;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Service
public class GoogleAuthService {

    @Value("${google.clientId}")
    private String clientId;

    @Value("${google.clientSecret}")
    private String clientSecret;

    @Value("${google.redirectUri}")
    private String redirectUri;

    private final RestTemplate restTemplate;
    private final CustomUserDetailService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public GoogleAuthService(
            RestTemplate restTemplate,
            CustomUserDetailService userDetailsService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JWTService jwtService) {

        this.restTemplate = restTemplate;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String getAccessTokenUsingCode(String code, HttpServletResponse response) {

        String tokenEndpoint = "https://oauth2.googleapis.com/token"; // this is the endpoint to get the token

        try {
            // Step 1: Prepare form params (like sending a form submission in real life)
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code"); // means we're using auth code to exchange

            // Step 2: Set headers (metadata)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Step 3: Combine headers + params into a request
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            // Step 4: Make the POST call to Google's token endpoint
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenEndpoint, request, Map.class);

            // Step 5: Extract access token
            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // Step 6: Use token to get user info
            String userInfoUrl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + accessToken;
            ResponseEntity<Map> userInfoResponse = restTemplate.getForEntity(userInfoUrl, Map.class);

            if (userInfoResponse.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> userInfo = userInfoResponse.getBody();
                String email = (String) userInfo.get("email");

                // Step 7: If user not in DB, create one
                if (!userRepository.existsByEmail(email)) {
                    User user = new User();
                    user.setEmail(email);
                    user.setUsername(email);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // random pwd
                    user.setRole(Role.ROLE_USER);

                    userRepository.save(user);
                }

                // Step 8: Generate app tokens (JWTs)
                User user = userRepository.findByEmail(email);
                String appAccessToken = jwtService.generateAccessToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                // Step 9: Send refresh token as HttpOnly secure cookie
                String cookieValue = String.format(
                        "jwtToken=%s; Path=/; HttpOnly; Secure; SameSite=None",
                        refreshToken
                );
                response.addHeader("Set-Cookie", cookieValue);

                return appAccessToken;
            }

        } catch (Exception e) {
            return "Something went wrong with your authentication code. Use debugger.";
        }

        return "Token exchange failed.";
    }
}
