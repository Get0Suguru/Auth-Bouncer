package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Parser;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTService {

    @Autowired
    private UserRepository userRepo;

    @Value("${jwt.secret}")                             // getting value from the application.properties (config file)
    private String jwtSecret;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenDurationMs;

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenDurationMs;

//#Public methods----------------------Jwts class will help with all (parsing, validation, building etc)----------------------------------

    public String generateAccessToken(User user){ return buildToken(user, accessTokenDurationMs); }
    public String generateRefreshToken(User user){
        return buildToken(user, refreshTokenDurationMs);
    }

    // token validation ask for 1. username from token to exist in db + 2. token is not expired
    public boolean isTokenValid(String token){ return (userRepo.existsByEmail(extractEmail(token)) && !isTokenExpired(token));}


// ------------------------------------------------------------------------------------------------------------------------
    // new way -> generate a key obj for ur secret and then pass
    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // build token take ->   2 arguments and give token based on that  |  user-> to get req payload out of it   &  expiration time
    private String buildToken(User user, Long expiration){

        return Jwts.builder()                                     // to make jwt token  (scratch build)
                .subject(user.getEmail())                      // subject is a predefined payload in jwt
                .claim("role", user.getRole().name())       // claim is for custom payload | .name give the exact enum as string
                .issuedAt(new Date())                             // issued at time | new date give current time
                .expiration(new Date(System.currentTimeMillis() + expiration))       // adding expiration in milliseconds
                .signWith(getKey())                      // there are multi constructor in singWith
                .compact();                                     // puts in one string header.payload.signature as one string and return
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

//#----- To Extract Claims (payload) from token -----------||  two things -> extract all claim -> generic fxn for specific claim

    private Claims extractAllClaims(String token){

    //  1. build the jwt parser and configure it with the secret key (it checks the temperament of signature))
         JwtParser parser = Jwts.parser().verifyWith(getKey()).build();                 // This object will help you validate and read JWT tokens.

    // 2. parse the jwt with the parser and extract the payload (claims)
        Claims claims = parser.parseSignedClaims(token).getPayload();
        return claims;      // return all claims in a map format (key value pair)
    }


  // generic function to extract any specific claim out of all--
    private <T> T extractSingleClaim(String jwtToken, Function<Claims, T> extractor){
        Claims allClaims = extractAllClaims(jwtToken);
        return extractor.apply(allClaims);
        // this is just the calling and what argument pass  (the actually impl of function interface methods are when they used using lambda
    }



//  Public mehtods ---------------time to put claim extractor in action ---------------------------------------------------

    public String extractEmail(String jwtToken) {
//        extractSingleClaim(jwtToken, x-> x.getExpiration());              // what is used to be in backend (for can't visualize)
        return extractSingleClaim(jwtToken,Claims::getSubject);
    }

    private Date extractExpiration(String jwtToken) {
        return extractSingleClaim(jwtToken,Claims::getExpiration);
    }


}
