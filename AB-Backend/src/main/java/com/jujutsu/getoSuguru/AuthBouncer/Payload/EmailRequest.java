package com.jujutsu.getoSuguru.AuthBouncer.Payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {

    @NotBlank(message = "Email is required")
    private String email;
}
