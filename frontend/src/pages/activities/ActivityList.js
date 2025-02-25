import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter, FaCheck } from 'react-icons/fa';
import { activityService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Load activities
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                let response;

                if (filterType) {
                    response = await activityService.getActivitiesByType(filterType);
                } else if (filterStatus) {
                    response = await activityService.getActivitiesByStatus(filterStatus);
                } else {
                    response = await activityService.getAllActivities();
                }

                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [filterType, filterStatus]);

    // Handle delete
    const handleDelete = async () => {
        if (!activityToDelete) return;

        try {
            await activityService.deleteActivity(activityToDelete.id);
            setActivities(activities.filter(activity => activity.id !== activityToDelete.id));
            setShowDeleteModal(false);
            setActivityToDelete(null);
        } catch (error) {
            console.error('Error deleting activity', error);
        }
    };

    // Handle complete activity
    const handleCompleteActivity = async (id) => {
        try {
            const response = await activityService.completeActivity(id);
            // Update the activity in the list
            setActivities(activities.map(activity =>
                activity.id === id ? response.data : activity
            ));
        } catch (error) {
            console.error('Error completing activity', error);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilterType('');
        setFilterStatus('');
    };

    // Activity type options
    const typeOptions = ['Call', 'Email', 'Meeting', 'Note', 'Task'];

    // Activity status options
    const statusOptions = ['Planned', 'Completed', 'Cancelled'];

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Activities</h1>
                <Button as={Link} to="/activities/new" variant="primary">
                    <FaPlus className="me-2" /> Add Activity
                </Button>
            </div>

            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Filters</h5>
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
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        value={filterType}
                                        onChange={(e) => {
                                            setFilterType(e.target.value);
                                            setFilterStatus(''); // Reset other filter
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        {typeOptions.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setFilterType(''); // Reset other filter
                                        }}
                                    >
                                        <option value="">All Statuses</option>
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {(filterType || filterStatus) && (
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
                                <th>Subject</th>
                                <th>Type</th>
                                <th>Related To</th>
                                <th>Scheduled Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No activities found.
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity.id}>
                                        <td>
                                            <Link to={`/activities/${activity.id}`} className="fw-bold text-decoration-none">
                                                {activity.subject}
                                            </Link>
                                        </td>
                                        <td>{activity.type}</td>
                                        <td>
                                            {activity.customer ? (
                                                <Link to={`/customers/${activity.customer.id}`}>
                                                    {activity.customer.companyName}
                                                </Link>
                                            ) : activity.contact ? (
                                                <Link to={`/contacts/${activity.contact.id}`}>
                                                    {activity.contact.firstName} {activity.contact.lastName}
                                                </Link>
                                            ) : activity.opportunity ? (
                                                <Link to={`/opportunities/${activity.opportunity.id}`}>
                                                    {activity.opportunity.name}
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {activity.scheduledDate ?
                                                new Date(activity.scheduledDate).toLocaleString() : '-'}
                                        </td>
                                        <td>
                                            <Badge bg={
                                                activity.status === 'Planned' ? 'info' :
                                                    activity.status === 'Completed' ? 'success' : 'secondary'
                                            }>
                                                {activity.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            {activity.status !== 'Completed' && (
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    className="me-1"
                                                    title="Mark as completed"
                                                    onClick={() => handleCompleteActivity(activity.id)}
                                                >
                                                    <FaCheck />
                                                </Button>
                                            )}
                                            <Button
                                                as={Link}
                                                to={`/activities/${activity.id}/edit`}
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-1"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    setActivityToDelete(activity);
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
                title="Delete Activity"
                message={`Are you sure you want to delete ${activityToDelete?.subject}? This action cannot be undone.`}
            />
        </Container>
    );
};

export default ActivityList;