package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.model.Customer;
import org.example.model.Opportunity;
import org.example.service.CustomerService;
import org.example.service.OpportunityService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        List<Opportunity> opportunities = opportunityService.findAllOpportunities();
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable Long id) {
        return opportunityService.findOpportunityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByCustomer(@PathVariable Long customerId) {
        Optional<Customer> customer = customerService.findCustomerById(customerId);
        if (!customer.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Opportunity> opportunities = opportunityService.findOpportunitiesByCustomer(customer.get());
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByStatus(@PathVariable String status) {
        List<Opportunity> opportunities = opportunityService.findOpportunitiesByStatus(status);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByStage(@PathVariable String stage) {
        List<Opportunity> opportunities = opportunityService.findOpportunitiesByStage(stage);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/closing-date-range")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByClosingDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Opportunity> opportunities = opportunityService.findOpportunitiesClosingBetween(startDate, endDate);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/high-value")
    public ResponseEntity<List<Opportunity>> getHighValueOpportunities(@RequestParam BigDecimal threshold) {
        List<Opportunity> opportunities = opportunityService.findHighValueOpportunities(threshold);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/value/status/{status}")
    public ResponseEntity<BigDecimal> getTotalOpportunityValueByStatus(@PathVariable String status) {
        BigDecimal totalValue = opportunityService.calculateTotalOpportunityValueByStatus(status);
        return ResponseEntity.ok(totalValue);
    }

    @PostMapping
    public ResponseEntity<Opportunity> createOpportunity(@Valid @RequestBody Opportunity opportunity) {
        if (opportunity.getId() != null) {
            return ResponseEntity.badRequest().build();
        }

        // Check if customer exists
        if (opportunity.getCustomer() != null && opportunity.getCustomer().getId() != null) {
            Optional<Customer> customer = customerService.findCustomerById(opportunity.getCustomer().getId());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            opportunity.setCustomer(customer.get());
        }

        Opportunity savedOpportunity = opportunityService.saveOpportunity(opportunity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOpportunity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(@PathVariable Long id, @Valid @RequestBody Opportunity opportunity) {
        if (!opportunityService.findOpportunityById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Check if customer exists
        if (opportunity.getCustomer() != null && opportunity.getCustomer().getId() != null) {
            Optional<Customer> customer = customerService.findCustomerById(opportunity.getCustomer().getId());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            opportunity.setCustomer(customer.get());
        }

        opportunity.setId(id);
        Opportunity updatedOpportunity = opportunityService.saveOpportunity(opportunity);
        return ResponseEntity.ok(updatedOpportunity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable Long id) {
        if (!opportunityService.findOpportunityById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        opportunityService.deleteOpportunity(id);
        return ResponseEntity.noContent().build();
    }
}