package com.jujutsu.getoSuguru.AuthBouncer.repository;

import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setUsername("test");
        userRepository.save(user);
    }

    @Test
    void existsByEmail_returnsTrue_afterSavingUser() {
        assertTrue(userRepository.existsByEmail("test@test.com"));
    }

    @Test
    void existsByUsername_returnsTrue_afterSavingUser() {
        assertTrue(userRepository.existsByUsername("test"));
    }

    @Test
    void findByEmail_returnsUser_afterSavingUser() {
        User user = userRepository.findByEmail("test@test.com");
        assertNotNull(user);
    }

    @Test
    void findByUsername_returnsUser_afterSavingUser() {
        User user = userRepository.findByUsername("test");
        assertNotNull(user);
    }


}