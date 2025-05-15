package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.GithHubAuthException;
import com.jujutsu.getoSuguru.AuthBouncer.model.GithubEmail;
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

import java.util.*;

@Service
public class GithubOAuthService {

    @Value("${github.clientId}")
    private String clientId;

    @Value("${github.clientSecret}")
    private String clientSecret;

    @Value("${github.redirectUri}")
    private String redirectUri;

    private RestTemplate restTemplate;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JWTService jwtService;

    public GithubOAuthService(RestTemplate restTemplate, UserRepository userRepository, PasswordEncoder passwordEncoder, JWTService jwtService) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String getAccessTokenUsingCode(String code, HttpServletResponse response) throws GithHubAuthException {

        String tokenEndpoint = "https://github.com/login/oauth/access_token"; // this is the endpoint to get the token

        try {
            // Step 1: Prepare form params (like sending a form submission in real life)
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);


            // Step 2: Set headers (metadata)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);   // telling we are sending stuff as form data
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));


            // Step 3: Combine headers + params into a request
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            // Step 4: Make the POST call to Google's token endpoint
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenEndpoint, request, Map.class);

            // Step 5: Extract access token
            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // Step 6: Use token to get user info
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

            ResponseEntity<String> userResponse = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    userRequest,
                    String.class);
            if (userResponse.getStatusCode().is2xxSuccessful()) {

                String jsonArrayString = userResponse.getBody();

// parse JSON, pick primary verified email as discussed earlier

                ObjectMapper mapper = new ObjectMapper();

// Parse JSON array into array of GithubEmail
                GithubEmail[] emailsArray = mapper.readValue(jsonArrayString, GithubEmail[].class);

// Convert to List if you want
                List<GithubEmail> emailsList = Arrays.asList(emailsArray);

                String primaryEmail = emailsList.stream()
                        .filter(e -> e.isPrimary() && e.isVerified())
                        .map(GithubEmail::getEmail)
                        .findFirst()
                        .orElse(null);




                // Step 7: If user not in DB, create one
                if (primaryEmail != null && !userRepository.existsByEmail(primaryEmail)) {
                    User user = new User();
                    user.setEmail(primaryEmail);
                    user.setUsername(primaryEmail);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // random pwd
                    user.setRole(Role.ROLE_USER);

                    userRepository.save(user);
                }

                // Step 8: Generate app tokens (JWTs)
                User user = userRepository.findByEmail(primaryEmail);
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
            throw new GithHubAuthException("Token exchange failed. use debugger (hint: might be variable issue)");
        }

        return "Token exchange failed.";
    }
}
