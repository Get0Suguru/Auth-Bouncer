package com.jujutsu.getoSuguru.AuthBouncer.config;

import com.jujutsu.getoSuguru.AuthBouncer.service.CustomUserDetailService;
import com.jujutsu.getoSuguru.AuthBouncer.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFIlter extends OncePerRequestFilter {

    private JWTService jwtService;
    private CustomUserDetailService userDetailService;

    public JWTFIlter(JWTService jwtService, CustomUserDetailService userDetailService) {
        this.jwtService = jwtService;
        this.userDetailService = userDetailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");         // this must start with Bearer


        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            if (jwtService.isTokenValid(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {

                // if that's verified, means user is there in db & token is not expired  -> so we can set the context holder (passport)
                // get the user  as UserDetails obj (custom UserDetailService) will help u

                UserDetails userDetailsObj = userDetailService.loadUserByUsername(jwtService.extractEmail(jwt));

                // now set the authentication in the security context holder
//                                                        1. user details obj 2. null (no credentials) 3. authorities(role)
                UsernamePasswordAuthenticationToken passport = new UsernamePasswordAuthenticationToken(userDetailsObj, null, userDetailsObj.getAuthorities());
                passport.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // details of the request (ip, port etc) setted to the passport

                // set the passport in the security context holder (saving it so that it can be used in various parts to complet ur request)
                SecurityContextHolder.getContext().setAuthentication(passport);

                filterChain.doFilter(request, response);        // go to next filter

            }
            else {
                System.out.println("token is not valid");
                filterChain.doFilter(request, response);
            }
        }
        else {
            System.out.println("might be a public request (coz no valid token found)");
            filterChain.doFilter(request, response);
        }
    }
}
