import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { productService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response;

                if (searchTerm) {
                    response = await productService.searchProductsByName(searchTerm);
                } else if (filterCategory) {
                    response = await productService.getProductsByCategory(filterCategory);
                } else if (filterStatus) {
                    response = await productService.getProductsByStatus(filterStatus);
                } else if (priceRange.min && priceRange.max) {
                    response = await productService.getProductsInPriceRange(priceRange.min, priceRange.max);
                } else if (priceRange.max) {
                    response = await productService.getProductsUnderPrice(priceRange.max);
                } else {
                    response = await productService.getAllProducts();
                }

                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm, filterCategory, filterStatus, priceRange.min, priceRange.max]);

    // Handle delete
    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            await productService.deleteProduct(productToDelete.id);
            setProducts(products.filter(product => product.id !== productToDelete.id));
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
        setPriceRange({ min: '', max: '' });
    };

    // Derived values
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    const uniqueStatuses = [...new Set(products.map(product => product.status))];

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Products</h1>
                <Button as={Link} to="/products/new" variant="primary">
                    <FaPlus className="me-2" /> Add Product
                </Button>
            </div>

            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Search & Filters</h5>
                    <Button
                        variant="link"
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-0"
                    >
                        <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={12} className="mb-3">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search products by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {(searchTerm || filterCategory || filterStatus || priceRange.min || priceRange.max) && (
                                    <Button variant="outline-secondary" onClick={resetFilters}>
                                        Clear
                                    </Button>
                                )}
                            </InputGroup>
                        </Col>

                        {showFilters && (
                            <>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                        >
                                            <option value="">All Categories</option>
                                            {uniqueCategories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="">All Statuses</option>
                                            {uniqueStatuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price Range</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                placeholder="Min"
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            />
                                            <InputGroup.Text>to</InputGroup.Text>
                                            <Form.Control
                                                placeholder="Max"
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </>
                        )}
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    {loading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <Link to={`/products/${product.id}`} className="fw-bold text-decoration-none">
                                                {product.code}
                                            </Link>
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>
                                            {product.listPrice ? `$${product.listPrice.toLocaleString()}` : '-'}
                                        </td>
                                        <td>
                                            <Badge bg={
                                                product.status === 'Active' ? 'success' :
                                                    product.status === 'Inactive' ? 'secondary' :
                                                        product.status === 'Discontinued' ? 'danger' : 'warning'
                                            }>
                                                {product.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                as={Link}
                                                to={`/products/${product.id}/edit`}
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    setProductToDelete(product);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <DeleteConfirmation
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete ${productToDelete?.name} (${productToDelete?.code})? This action cannot be undone.`}
            />
        </Container>
    );
};

export default ProductList;