package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.Customer;
import org.example.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> findCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public List<Customer> findCustomersByName(String name) {
        return customerRepository.findByCompanyNameContainingIgnoreCase(name);
    }

    public List<Customer> findCustomersByStatus(String status) {
        return customerRepository.findByStatus(status);
    }

    public List<Customer> findCustomersByIndustry(String industry) {
        return customerRepository.findByIndustry(industry);
    }

    @Transactional
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public boolean isCompanyNameTaken(String companyName) {
        return customerRepository.existsByCompanyNameIgnoreCase(companyName);
    }
}