package com.jujutsu.getoSuguru.AuthBouncer.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserProfile implements UserDetails {

    private User userObj;

    public UserProfile(User user){
        this.userObj = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = userObj.getRole().name();           // create the Rolename as String with prefix USER_
        return List.of(new SimpleGrantedAuthority(roleName));           // then pass it into to make List (new SimpleGrantedAuthority)
    }

    @Override
    public String getPassword() {
        return userObj.getPassword();
    }

    @Override
    public String getUsername() {
        return userObj.getEmail();
    }
}
