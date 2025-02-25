-- Customers
INSERT INTO customers (company_name, industry, website, status, created_at, updated_at)
VALUES
    ('Acme Corporation', 'Technology', 'http://www.acme.com', 'Active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('Global Industries', 'Manufacturing', 'http://www.globalind.com', 'Active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('Smith & Co', 'Consulting', 'http://www.smithco.com', 'Inactive', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('Tech Solutions', 'Technology', 'http://www.techsol.com', 'Active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('Healthcare Plus', 'Healthcare', 'http://www.healthcareplus.com', 'Prospect', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Products
INSERT INTO products (code, name, description, list_price, category, status, created_at, updated_at)
VALUES
    ('PROD-001', 'Basic CRM License', 'Entry-level CRM solution', 99.99, 'Software', 'Active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('PROD-002', 'Advanced CRM License', 'Full-featured CRM solution', 299.99, 'Software', 'Active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('PROD-003', 'Premium Support', 'Priority support package', 199.99, 'Service', 'Active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());