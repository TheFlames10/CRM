import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { activityService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                setLoading(true);
                const activityResponse = await activityService.getActivityById(id);
                setActivity(activityResponse.data);
            } catch (error) {
                console.error('Error fetching activity data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await activityService.deleteActivity(id);
            navigate('/activities');
        } catch (error) {
            console.error('Error deleting activity', error);
        }
    };

    const handleComplete = async () => {
        try {
            const response = await activityService.completeActivity(id);
            setActivity(response.data);
        } catch (error) {
            console.error('Error completing activity', error);
        }
    };

    if (loading) {
        return (
            <Container className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (!activity) {
        return (
            <Container className="text-center p-5">
                <h3>Activity not found</h3>
                <Button as={Link} to="/activities" variant="primary" className="mt-3">
                    Back to Activities
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{activity.subject}</h1>
                <div>
                    {activity.status !== 'Completed' && (
                        <Button
                            variant="success"
                            className="me-2"
                            onClick={handleComplete}
                        >
                            <FaCheck className="me-2" /> Mark Complete
                        </Button>
                    )}
                    <Button
                        as={Link}
                        to={`/activities/${id}/edit`}
                        variant="primary"
                        className="me-2"
                    >
                        <FaEdit className="me-2" /> Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <FaTrash className="me-2" /> Delete
                    </Button>
                </div>
            </div>

            <Row>
                <Col lg={4}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Activity Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <dl className="row mb-0">
                                <dt className="col-sm-4">Type</dt>
                                <dd className="col-sm-8">{activity.type}</dd>

                                <dt className="col-sm-4">Status</dt>
                                <dd className="col-sm-8">
                                    <Badge bg={
                                        activity.status === 'Planned' ? 'info' :
                                            activity.status === 'Completed' ? 'success' : 'secondary'
                                    }>
                                        {activity.status}
                                    </Badge>
                                </dd>

                                <dt className="col-sm-4">Scheduled</dt>
                                <dd className="col-sm-8">
                                    {activity.scheduledDate ? (
                                        <div>
                                            <FaCalendarAlt className="me-1" />
                                            {new Date(activity.scheduledDate).toLocaleDateString()}
                                            <br />
                                            <FaClock className="me-1" />
                                            {new Date(activity.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    ) : '-'}
                                </dd>

                                {activity.completedDate && (
                                    <>
                                        <dt className="col-sm-4">Completed</dt>
                                        <dd className="col-sm-8">
                                            {new Date(activity.completedDate).toLocaleString()}
                                        </dd>
                                    </>
                                )}

                                <dt className="col-sm-4">Customer</dt>
                                <dd className="col-sm-8">
                                    {activity.customer ? (
                                        <Link to={`/customers/${activity.customer.id}`}>
                                            {activity.customer.companyName}
                                        </Link>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Contact</dt>
                                <dd className="col-sm-8">
                                    {activity.contact ? (
                                        <Link to={`/contacts/${activity.contact.id}`}>
                                            {activity.contact.firstName} {activity.contact.lastName}
                                        </Link>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Opportunity</dt>
                                <dd className="col-sm-8">
                                    {activity.opportunity ? (
                                        <Link to={`/opportunities/${activity.opportunity.id}`}>
                                            {activity.opportunity.name}
                                        </Link>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Created</dt>
                                <dd className="col-sm-8">
                                    {new Date(activity.createdAt).toLocaleDateString()}
                                </dd>

                                <dt className="col-sm-4">Last Updated</dt>
                                <dd className="col-sm-8">
                                    {activity.updatedAt ? new Date(activity.updatedAt).toLocaleDateString() : '-'}
                                </dd>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Description</h5>
                        </Card.Header>
                        <Card.Body>
                            {activity.description ? (
                                <p>{activity.description}</p>
                            ) : (
                                <p className="text-muted">No description available.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <DeleteConfirmation
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Activity"
                message={`Are you sure you want to delete "${activity.subject}"? This action cannot be undone.`}
            />
        </Container>
    );
};

export default ActivityDetail;