package com.jujutsu.getoSuguru.AuthBouncer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GithubEmail {

    private String Email;
    private boolean primary;
    private boolean verified;
    private String visibility;



}
