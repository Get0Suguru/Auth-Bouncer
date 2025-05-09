package com.jujutsu.getoSuguru.AuthBouncer.Payload;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JWTResponse {
    @NotNull(message = "Token is required")
    private String token;
    @NotNull(message = "Expires in is required")
    private Long expiresIn;
}
