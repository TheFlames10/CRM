package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.Contact;
import org.example.model.Customer;
import org.example.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactService {

    private final ContactRepository contactRepository;

    public List<Contact> findAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> findContactById(Long id) {
        return contactRepository.findById(id);
    }

    public List<Contact> findContactsByCustomer(Customer customer) {
        return contactRepository.findByCustomer(customer);
    }

    public List<Contact> findPrimaryContacts() {
        return contactRepository.findByIsPrimaryTrue();
    }

    public List<Contact> findContactsByName(String name) {
        return contactRepository.findByName(name);
    }

    public Optional<Contact> findContactByEmail(String email) {
        return contactRepository.findByEmailIgnoreCase(email);
    }

    public List<Contact> findPrimaryContactForCustomer(Customer customer) {
        return contactRepository.findByCustomerAndIsPrimary(customer, true);
    }

    @Transactional
    public Contact saveContact(Contact contact) {
        // If this contact is marked as primary, ensure no other contacts for the same customer are primary
        if (contact.isPrimary() && contact.getCustomer() != null) {
            List<Contact> primaryContacts = contactRepository.findByCustomerAndIsPrimary(contact.getCustomer(), true);
            primaryContacts.stream()
                    .filter(c -> !c.getId().equals(contact.getId()))
                    .forEach(c -> {
                        c.setPrimary(false);
                        contactRepository.save(c);
                    });
        }
        return contactRepository.save(contact);
    }

    @Transactional
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}