package org.example.repository;

import org.example.model.Activity;
import org.example.model.Contact;
import org.example.model.Customer;
import org.example.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    // Find activities by customer
    List<Activity> findByCustomer(Customer customer);

    // Find activities by contact
    List<Activity> findByContact(Contact contact);

    // Find activities by opportunity
    List<Activity> findByOpportunity(Opportunity opportunity);

    // Find activities by type
    List<Activity> findByType(String type);

    // Find activities by status
    List<Activity> findByStatus(String status);

    // Find activities scheduled between two dates
    List<Activity> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find activities by customer and type
    List<Activity> findByCustomerAndType(Customer customer, String type);

    // Find recent activities
    List<Activity> findTop10ByOrderByCreatedAtDesc();

    // Find upcoming activities
    List<Activity> findByScheduledDateAfterAndStatusOrderByScheduledDateAsc(LocalDateTime date, String status);
}