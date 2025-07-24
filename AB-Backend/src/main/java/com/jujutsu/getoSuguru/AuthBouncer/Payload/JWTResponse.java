package com.jujutsu.getoSuguru.AuthBouncer.Payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JWTResponse {
    private String token;
    private Long expiresIn;
}
