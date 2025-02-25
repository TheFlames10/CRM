import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { opportunityService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const OpportunityList = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterStage, setFilterStage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [opportunityToDelete, setOpportunityToDelete] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Load opportunities
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                let response;

                if (filterStatus) {
                    response = await opportunityService.getOpportunitiesByStatus(filterStatus);
                } else if (filterStage) {
                    response = await opportunityService.getOpportunitiesByStage(filterStage);
                } else {
                    response = await opportunityService.getAllOpportunities();
                }

                setOpportunities(response.data);
            } catch (error) {
                console.error('Error fetching opportunities', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [filterStatus, filterStage]);

    // Handle delete
    const handleDelete = async () => {
        if (!opportunityToDelete) return;

        try {
            await opportunityService.deleteOpportunity(opportunityToDelete.id);
            setOpportunities(opportunities.filter(opportunity => opportunity.id !== opportunityToDelete.id));
            setShowDeleteModal(false);
            setOpportunityToDelete(null);
        } catch (error) {
            console.error('Error deleting opportunity', error);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilterStatus('');
        setFilterStage('');
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'New':
                return 'info';
            case 'Qualified':
                return 'primary';
            case 'Proposal':
                return 'warning';
            case 'Negotiation':
                return 'danger';
            case 'Closed Won':
                return 'success';
            case 'Closed Lost':
                return 'secondary';
            default:
                return 'light';
        }
    };

    // Status options
    const statusOptions = [
        'New',
        'Qualified',
        'Proposal',
        'Negotiation',
        'Closed Won',
        'Closed Lost'
    ];

    // Stage options
    const stageOptions = [
        'Discovery',
        'Qualification',
        'Proposal',
        'Negotiation',
        'Contract'
    ];

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Opportunities</h1>
                <Button as={Link} to="/opportunities/new" variant="primary">
                    <FaPlus className="me-2" /> Add Opportunity
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
                    {showFilters && (
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setFilterStage(''); // Reset other filter
                                        }}
                                    >
                                        <option value="">All Statuses</option>
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stage</Form.Label>
                                    <Form.Select
                                        value={filterStage}
                                        onChange={(e) => {
                                            setFilterStage(e.target.value);
                                            setFilterStatus(''); // Reset other filter
                                        }}
                                    >
                                        <option value="">All Stages</option>
                                        {stageOptions.map(stage => (
                                            <option key={stage} value={stage}>{stage}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {(filterStatus || filterStage) && (
                                <Col md={12} className="text-end">
                                    <Button
                                        variant="outline-secondary"
                                        className="mb-3"
                                        onClick={resetFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    )}
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
                                <th>Name</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Stage</th>
                                <th>Amount</th>
                                <th>Closing Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {opportunities.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No opportunities found.
                                    </td>
                                </tr>
                            ) : (
                                opportunities.map((opportunity) => (
                                    <tr key={opportunity.id}>
                                        <td>
                                            <Link to={`/opportunities/${opportunity.id}`} className="fw-bold text-decoration-none">
                                                {opportunity.name}
                                            </Link>
                                        </td>
                                        <td>
                                            {opportunity.customer ? (
                                                <Link to={`/customers/${opportunity.customer.id}`}>
                                                    {opportunity.customer.companyName}
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <Badge bg={getStatusBadgeColor(opportunity.status)}>
                                                {opportunity.status}
                                            </Badge>
                                        </td>
                                        <td>{opportunity.stage || '-'}</td>
                                        <td>
                                            {opportunity.amount ? `$${opportunity.amount.toLocaleString()}` : '-'}
                                        </td>
                                        <td>
                                            {opportunity.closingDate ?
                                                new Date(opportunity.closingDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td>
                                            <Button
                                                as={Link}
                                                to={`/opportunities/${opportunity.id}/edit`}
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
                                                    setOpportunityToDelete(opportunity);
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
                title="Delete Opportunity"
                message={`Are you sure you want to delete ${opportunityToDelete?.name}? This action cannot be undone.`}
            />
        </Container>
    );
};

export default OpportunityList;