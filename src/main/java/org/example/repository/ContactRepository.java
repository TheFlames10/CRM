package org.example.repository;

import org.example.model.Contact;
import org.example.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    // Find contacts by customer
    List<Contact> findByCustomer(Customer customer);

    // Find primary contacts
    List<Contact> findByIsPrimaryTrue();

    // Find contacts by email
    Optional<Contact> findByEmailIgnoreCase(String email);

    // Find contacts by first name or last name containing the given string
    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Contact> findByName(String name);

    // Find contacts by customer and whether they are primary
    List<Contact> findByCustomerAndIsPrimary(Customer customer, boolean isPrimary);
}