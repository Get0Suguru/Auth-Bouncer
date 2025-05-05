package com.jujutsu.getoSuguru.AuthBouncer.model;

import com.jujutsu.getoSuguru.AuthBouncer.model.audit.DateAudit;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="users")
@Data

public class User extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique = true)
    private String email;
    
    @Column(unique=true)
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)                    // odinal will use 0, 1, 2 for roles | we don't want that
    @Column(length = 60)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(length = 60)
    private AuthProvider provider;


    private Boolean isVerified;

}
