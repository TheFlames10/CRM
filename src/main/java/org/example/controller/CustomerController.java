package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.model.Customer;
import org.example.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.findAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.findCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String industry) {

        if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(customerService.findCustomersByName(name));
        } else if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(customerService.findCustomersByStatus(status));
        } else if (industry != null && !industry.isEmpty()) {
            return ResponseEntity.ok(customerService.findCustomersByIndustry(industry));
        } else {
            return ResponseEntity.ok(customerService.findAllCustomers());
        }
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        if (customer.getId() != null) {
            return ResponseEntity.badRequest().build();
        }

        if (customerService.isCompanyNameTaken(customer.getCompanyName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Customer savedCustomer = customerService.saveCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        if (!customerService.findCustomerById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        customer.setId(id);
        Customer updatedCustomer = customerService.saveCustomer(customer);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerService.findCustomerById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}