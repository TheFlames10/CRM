package org.example.repository;

import org.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Find product by code
    Optional<Product> findByCode(String code);

    // Find products by name containing the given string
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products by category
    List<Product> findByCategory(String category);

    // Find products by status
    List<Product> findByStatus(String status);

    // Find products with price less than the specified value
    List<Product> findByListPriceLessThan(BigDecimal maxPrice);

    // Find products with price between the specified values
    List<Product> findByListPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Check if a product exists by code
    boolean existsByCode(String code);
}