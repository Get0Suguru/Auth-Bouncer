package com.jujutsu.getoSuguru.AuthBouncer.Payload;

import jakarta.persistence.Access;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangePasswordRequest {


    @NotNull(message = "Current password is required")
    private String newPassword;
    @NotNull(message = "otp is required")
    private String otp;


}
