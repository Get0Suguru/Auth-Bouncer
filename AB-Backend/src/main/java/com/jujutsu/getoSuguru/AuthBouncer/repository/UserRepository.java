package com.jujutsu.getoSuguru.AuthBouncer.repository;

import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long > {

        public User findByUsername(String username);

        public User findByEmail(String email);

        public Boolean existsByUsername(String username);

        public Boolean existsByEmail(String email);
}
