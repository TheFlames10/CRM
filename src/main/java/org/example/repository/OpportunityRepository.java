package org.example.repository;

import org.example.model.Customer;
import org.example.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    // Find opportunities by customer
    List<Opportunity> findByCustomer(Customer customer);

    // Find opportunities by status
    List<Opportunity> findByStatus(String status);

    // Find opportunities by stage
    List<Opportunity> findByStage(String stage);

    // Find opportunities with amount greater than the specified value
    List<Opportunity> findByAmountGreaterThan(BigDecimal amount);

    // Find opportunities closing within a date range
    List<Opportunity> findByClosingDateBetween(LocalDate startDate, LocalDate endDate);

    // Find opportunities by customer and status
    List<Opportunity> findByCustomerAndStatus(Customer customer, String status);

    // Calculate total opportunity value by status
    @Query("SELECT SUM(o.amount) FROM Opportunity o WHERE o.status = :status")
    BigDecimal calculateTotalAmountByStatus(String status);
}