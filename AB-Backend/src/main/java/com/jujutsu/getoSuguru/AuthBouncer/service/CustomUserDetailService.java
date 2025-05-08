package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.model.UserProfile;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private UserRepository userRepo;


    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepo = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepo.findByEmail(email);

        if(user != null){
            return new UserProfile(user);
        }else{
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }
}
