package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.model.Contact;
import org.example.model.Customer;
import org.example.service.ContactService;
import org.example.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactService.findAllContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return contactService.findContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Contact>> getContactsByCustomer(@PathVariable Long customerId) {
        Optional<Customer> customer = customerService.findCustomerById(customerId);
        if (!customer.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Contact> contacts = contactService.findContactsByCustomer(customer.get());
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/primary")
    public ResponseEntity<List<Contact>> getPrimaryContacts() {
        List<Contact> primaryContacts = contactService.findPrimaryContacts();
        return ResponseEntity.ok(primaryContacts);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Contact>> searchContacts(@RequestParam String name) {
        List<Contact> contacts = contactService.findContactsByName(name);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/email")
    public ResponseEntity<Contact> getContactByEmail(@RequestParam String email) {
        return contactService.findContactByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        if (contact.getId() != null) {
            return ResponseEntity.badRequest().build();
        }

        // Check if customer exists
        if (contact.getCustomer() != null && contact.getCustomer().getId() != null) {
            Optional<Customer> customer = customerService.findCustomerById(contact.getCustomer().getId());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            contact.setCustomer(customer.get());
        }

        Contact savedContact = contactService.saveContact(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedContact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        if (!contactService.findContactById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Check if customer exists
        if (contact.getCustomer() != null && contact.getCustomer().getId() != null) {
            Optional<Customer> customer = customerService.findCustomerById(contact.getCustomer().getId());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            contact.setCustomer(customer.get());
        }

        contact.setId(id);
        Contact updatedContact = contactService.saveContact(contact);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (!contactService.findContactById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}