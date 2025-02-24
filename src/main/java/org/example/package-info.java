/**
 * This file ensures proper package structure creation in your IDE.
 *
 * The recommended package structure for this CRM application is:
 *
 * org.example
 * ├── CrmApplication.java        - Main application class
 * ├── model                      - Data models and entities
 * │   ├── Customer.java
 * │   ├── Contact.java
 * │   ├── Opportunity.java
 * │   ├── Activity.java
 * │   └── Product.java
 * ├── repository                 - Data access interfaces
 * │   ├── CustomerRepository.java
 * │   ├── ContactRepository.java
 * │   ├── OpportunityRepository.java
 * │   ├── ActivityRepository.java
 * │   └── ProductRepository.java
 * ├── service                    - Business logic classes
 * │   ├── CustomerService.java
 * │   ├── ContactService.java
 * │   ├── OpportunityService.java
 * │   ├── ActivityService.java
 * │   └── ProductService.java
 * └── controller                 - REST API controllers
 *     ├── CustomerController.java
 *     ├── ContactController.java
 *     ├── OpportunityController.java
 *     ├── ActivityController.java
 *     └── ProductController.java
 *
 * To ensure each repository class works with its corresponding entity,
 * make sure the entity class name in the JpaRepository generic parameter
 * matches your actual entity class.
 */
package org.example;