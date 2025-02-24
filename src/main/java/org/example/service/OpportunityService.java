package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.Customer;
import org.example.model.Opportunity;
import org.example.repository.OpportunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;

    public List<Opportunity> findAllOpportunities() {
        return opportunityRepository.findAll();
    }

    public Optional<Opportunity> findOpportunityById(Long id) {
        return opportunityRepository.findById(id);
    }

    public List<Opportunity> findOpportunitiesByCustomer(Customer customer) {
        return opportunityRepository.findByCustomer(customer);
    }

    public List<Opportunity> findOpportunitiesByStatus(String status) {
        return opportunityRepository.findByStatus(status);
    }

    public List<Opportunity> findOpportunitiesByStage(String stage) {
        return opportunityRepository.findByStage(stage);
    }

    public List<Opportunity> findOpportunitiesByCustomerAndStatus(Customer customer, String status) {
        return opportunityRepository.findByCustomerAndStatus(customer, status);
    }

    public List<Opportunity> findOpportunitiesClosingBetween(LocalDate startDate, LocalDate endDate) {
        return opportunityRepository.findByClosingDateBetween(startDate, endDate);
    }

    public List<Opportunity> findHighValueOpportunities(BigDecimal threshold) {
        return opportunityRepository.findByAmountGreaterThan(threshold);
    }

    public BigDecimal calculateTotalOpportunityValueByStatus(String status) {
        BigDecimal total = opportunityRepository.calculateTotalAmountByStatus(status);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional
    public Opportunity saveOpportunity(Opportunity opportunity) {
        return opportunityRepository.save(opportunity);
    }

    @Transactional
    public void deleteOpportunity(Long id) {
        opportunityRepository.deleteById(id);
    }
}