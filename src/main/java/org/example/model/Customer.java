package org.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    private String industry;

    private String website;

    @Column(nullable = false)
    private String status; // Active, Inactive, Prospect, etc.

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Opportunity> opportunities = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods for managing bidirectional relationships
    public void addContact(Contact contact) {
        contacts.add(contact);
        contact.setCustomer(this);
    }

    public void removeContact(Contact contact) {
        contacts.remove(contact);
        contact.setCustomer(null);
    }

    public void addOpportunity(Opportunity opportunity) {
        opportunities.add(opportunity);
        opportunity.setCustomer(this);
    }

    public void removeOpportunity(Opportunity opportunity) {
        opportunities.remove(opportunity);
        opportunity.setCustomer(null);
    }
}