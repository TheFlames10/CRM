package org.example.repository;

import org.example.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Find customers by company name containing the given string (case-insensitive)
    List<Customer> findByCompanyNameContainingIgnoreCase(String companyName);

    // Find customers by status
    List<Customer> findByStatus(String status);

    // Find customers by industry
    List<Customer> findByIndustry(String industry);

    // Check if a customer exists by company name
    boolean existsByCompanyNameIgnoreCase(String companyName);
}