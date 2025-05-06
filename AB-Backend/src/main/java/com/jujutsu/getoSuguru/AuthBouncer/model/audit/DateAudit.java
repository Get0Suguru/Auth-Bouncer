package com.jujutsu.getoSuguru.AuthBouncer.model.audit;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Data
public abstract class DateAudit {

    @CreatedDate
    @JsonIgnore
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @JsonIgnore
    private Instant updatedAt;
}
