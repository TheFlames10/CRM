import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { customerService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [error, setError] = useState(null);

    // Load customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                setError(null);
                let response;

                if (searchTerm) {
                    response = await customerService.searchCustomers({ name: searchTerm });
                } else if (filterStatus) {
                    response = await customerService.searchCustomers({ status: filterStatus });
                } else if (filterIndustry) {
                    response = await customerService.searchCustomers({ industry: filterIndustry });
                } else {
                    response = await customerService.getAllCustomers();
                }

                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers', error);
                setError('Failed to load customer data. Please try again.');
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [searchTerm, filterStatus, filterIndustry]);

    // Handle delete
    const handleDelete = async () => {
        if (!customerToDelete) return;

        try {
            await customerService.deleteCustomer(customerToDelete.id);
            setCustomers(customers.filter(customer => customer.id !== customerToDelete.id));
            setShowDeleteModal(false);
            setCustomerToDelete(null);
        } catch (error) {
            console.error('Error deleting customer', error);
            setError('Failed to delete customer. Please try again.');
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setFilterIndustry('');
    };

    // Derived values from actual data
    const uniqueStatuses = [...new Set(customers.filter(c => c.status).map(c => c.status))];
    const uniqueIndustries = [...new Set(customers.filter(c => c.industry).map(c => c.industry))];

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Customers</h1>
                <Button as={Link} to="/customers/new" variant="primary">
                    <FaPlus className="me-2" /> Add Customer
                </Button>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
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
                                <Form.Select
                                    value={filterIndustry}
                                    onChange={(e) => setFilterIndustry(e.target.value)}
                                >
                                    <option value="">All Industries</option>
                                    {uniqueIndustries.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    {(searchTerm || filterStatus || filterIndustry) && (
                        <div className="text-end">
                            <Button variant="outline-secondary" onClick={resetFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {error && (
                <div className="alert alert-danger mb-4" role="alert">
                    {error}
                </div>
            )}

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
                                <th>Company Name</th>
                                <th>Industry</th>
                                <th>Status</th>
                                <th>Website</th>
                                <th>Contacts</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        {error ? 'Error loading customers.' : 'No customers found.'}
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <Link to={`/customers/${customer.id}`} className="fw-bold text-decoration-none">
                                                {customer.companyName}
                                            </Link>
                                        </td>
                                        <td>{customer.industry || '-'}</td>
                                        <td>
                                            <Badge bg={
                                                customer.status === 'Active' ? 'success' :
                                                    customer.status === 'Inactive' ? 'secondary' :
                                                        customer.status === 'Prospect' ? 'info' : 'warning'
                                            }>
                                                {customer.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            {customer.website ? (
                                                <a href={customer.website} target="_blank" rel="noopener noreferrer">
                                                    {customer.website.replace(/^https?:\/\/(www\.)?/, '')}
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td>{customer.contacts?.length || 0}</td>
                                        <td>
                                            <Button
                                                as={Link}
                                                to={`/customers/${customer.id}/edit`}
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
                                                    setCustomerToDelete(customer);
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
                title="Delete Customer"
                message={`Are you sure you want to delete ${customerToDelete?.companyName}? This action cannot be undone.`}
            />
        </Container>
    );
};

export default CustomerList;