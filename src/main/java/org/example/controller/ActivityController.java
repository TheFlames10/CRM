package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.model.Activity;
import org.example.model.Contact;
import org.example.model.Customer;
import org.example.model.Opportunity;
import org.example.service.ActivityService;
import org.example.service.ContactService;
import org.example.service.CustomerService;
import org.example.service.OpportunityService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final CustomerService customerService;
    private final ContactService contactService;
    private final OpportunityService opportunityService;

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        List<Activity> activities = activityService.findAllActivities();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return activityService.findActivityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Activity>> getActivitiesByCustomer(@PathVariable Long customerId) {
        Optional<Customer> customer = customerService.findCustomerById(customerId);
        if (!customer.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Activity> activities = activityService.findActivitiesByCustomer(customer.get());
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Activity>> getActivitiesByContact(@PathVariable Long contactId) {
        Optional<Contact> contact = contactService.findContactById(contactId);
        if (!contact.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Activity> activities = activityService.findActivitiesByContact(contact.get());
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<List<Activity>> getActivitiesByOpportunity(@PathVariable Long opportunityId) {
        Optional<Opportunity> opportunity = opportunityService.findOpportunityById(opportunityId);
        if (!opportunity.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Activity> activities = activityService.findActivitiesByOpportunity(opportunity.get());
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Activity>> getActivitiesByType(@PathVariable String type) {
        List<Activity> activities = activityService.findActivitiesByType(type);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Activity>> getActivitiesByStatus(@PathVariable String status) {
        List<Activity> activities = activityService.findActivitiesByStatus(status);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Activity>> getActivitiesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<Activity> activities = activityService.findActivitiesByDateRange(startDate, endDate);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Activity>> getRecentActivities() {
        List<Activity> activities = activityService.findRecentActivities();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Activity>> getUpcomingActivities() {
        List<Activity> activities = activityService.findUpcomingActivities();
        return ResponseEntity.ok(activities);
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@Valid @RequestBody Activity activity) {
        if (activity.getId() != null) {
            return ResponseEntity.badRequest().build();
        }

        // Validate references to related entities
        if (activity.getCustomer() != null && activity.getCustomer().getId() != null) {
            Optional<Customer> customer = customerService.findCustomerById(activity.getCustomer().getId());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            activity.setCustomer(customer.get());
        }

        if (activity.getContact() != null && activity.getContact().getId() != null) {
            Optional<Contact> contact = contactService.findContactById(activity.getContact().getId());
            if (!contact.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            activity.setContact(contact.get());
        }

        if (activity.getOpportunity() != null && activity.getOpportunity().getId() != null) {
            Optional<Opportunity> opportunity = opportunityService.findOpportunityById(activity.getOpportunity().getId());
            if (!opportunity.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            activity.setOpportunity(opportunity.get());
        }

        Activity savedActivity = activityService.saveActivity(activity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedActivity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @Valid @RequestBody Activity activity) {
        if (!activityService.findActivityById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Validate references to related entities
        if (activity.getCustomer() != null && activity.getCustomer().getId() != null) {
            Optional<Customer> customer = customerService.findCustomerById(activity.getCustomer().getId());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            activity.setCustomer(customer.get());
        }

        if (activity.getContact() != null && activity.getContact().getId() != null) {
            Optional<Contact> contact = contactService.findContactById(activity.getContact().getId());
            if (!contact.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            activity.setContact(contact.get());
        }

        if (activity.getOpportunity() != null && activity.getOpportunity().getId() != null) {
            Optional<Opportunity> opportunity = opportunityService.findOpportunityById(activity.getOpportunity().getId());
            if (!opportunity.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            activity.setOpportunity(opportunity.get());
        }

        activity.setId(id);
        Activity updatedActivity = activityService.saveActivity(activity);
        return ResponseEntity.ok(updatedActivity);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Activity> completeActivity(@PathVariable Long id) {
        Activity completedActivity = activityService.completeActivity(id);
        if (completedActivity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(completedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        if (!activityService.findActivityById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}