// src/pages/opportunities/OpportunityDetail.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCalendarAlt, FaDollarSign, FaChartLine, FaPlus } from 'react-icons/fa';
import { opportunityService, activityService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [opportunity, setOpportunity] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchOpportunityData = async () => {
            try {
                setLoading(true);
                const opportunityResponse = await opportunityService.getOpportunityById(id);
                setOpportunity(opportunityResponse.data);

                // Fetch related activities
                const activitiesRes = await activityService.getActivitiesByOpportunity(id);
                setActivities(activitiesRes.data);
            } catch (error) {
                console.error('Error fetching opportunity data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunityData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await opportunityService.deleteOpportunity(id);
            navigate('/opportunities');
        } catch (error) {
            console.error('Error deleting opportunity', error);
        }
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

    // Get stage progress percentage
    const getStageProgress = (stage) => {
        const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Contract'];
        const index = stages.indexOf(stage);
        return index >= 0 ? (index + 1) * 20 : 0;
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

    if (!opportunity) {
        return (
            <Container className="text-center p-5">
                <h3>Opportunity not found</h3>
                <Button as={Link} to="/opportunities" variant="primary" className="mt-3">
                    Back to Opportunities
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{opportunity.name}</h1>
                <div>
                    <Button
                        as={Link}
                        to={`/opportunities/${id}/edit`}
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
                            <h5 className="mb-0">Opportunity Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <dl className="row mb-0">
                                <dt className="col-sm-4">Customer</dt>
                                <dd className="col-sm-8">
                                    {opportunity.customer ? (
                                        <Link to={`/customers/${opportunity.customer.id}`}>
                                            {opportunity.customer.companyName}
                                        </Link>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Status</dt>
                                <dd className="col-sm-8">
                                    <Badge bg={getStatusBadgeColor(opportunity.status)}>
                                        {opportunity.status}
                                    </Badge>
                                </dd>

                                <dt className="col-sm-4">Stage</dt>
                                <dd className="col-sm-8">{opportunity.stage || '-'}</dd>

                                <dt className="col-sm-4">Amount</dt>
                                <dd className="col-sm-8">
                                    {opportunity.amount ? (
                                        <span className="fw-bold">${opportunity.amount.toLocaleString()}</span>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Probability</dt>
                                <dd className="col-sm-8">
                                    {opportunity.probability ? `${opportunity.probability}%` : '-'}
                                </dd>

                                <dt className="col-sm-4">Closing Date</dt>
                                <dd className="col-sm-8">
                                    {opportunity.closingDate ?
                                        new Date(opportunity.closingDate).toLocaleDateString() : '-'}
                                </dd>

                                <dt className="col-sm-4">Created</dt>
                                <dd className="col-sm-8">
                                    {new Date(opportunity.createdAt).toLocaleDateString()}
                                </dd>

                                <dt className="col-sm-4">Last Updated</dt>
                                <dd className="col-sm-8">
                                    {opportunity.updatedAt ? new Date(opportunity.updatedAt).toLocaleDateString() : '-'}
                                </dd>
                            </dl>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Progress</h5>
                            <Badge bg={getStatusBadgeColor(opportunity.status)}>
                                {opportunity.status}
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            <ProgressBar
                                now={getStageProgress(opportunity.stage)}
                                label={`${getStageProgress(opportunity.stage)}%`}
                                className="mb-2"
                            />
                            <small className="text-muted">
                                Stage: {opportunity.stage || 'Not set'}
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Description</h5>
                        </Card.Header>
                        <Card.Body>
                            {opportunity.description ? (
                                <p>{opportunity.description}</p>
                            ) : (
                                <p className="text-muted">No description available.</p>
                            )}
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Related Activities</h5>
                            <Button
                                as={Link}
                                to="/activities/new"
                                state={{ opportunityId: id }}
                                variant="outline-primary"
                                size="sm"
                            >
                                <FaPlus className="me-1" /> Add Activity
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {activities.length === 0 ? (
                                <p className="text-center py-3">No activities found for this opportunity.</p>
                            ) : (
                                <Table responsive hover>
                                    <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Scheduled Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {activities.map((activity) => (
                                        <tr key={activity.id}>
                                            <td>
                                                <Link to={`/activities/${activity.id}`}>
                                                    {activity.subject}
                                                </Link>
                                            </td>
                                            <td>{activity.type}</td>
                                            <td>
                                                <Badge bg={
                                                    activity.status === 'Planned' ? 'info' :
                                                        activity.status === 'Completed' ? 'success' : 'secondary'
                                                }>
                                                    {activity.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {activity.scheduledDate ?
                                                    new Date(activity.scheduledDate).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <DeleteConfirmation
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Opportunity"
                message={`Are you sure you want to delete ${opportunity.name}? This action cannot be undone.`}
            />
        </Container>
    );
};

export default OpportunityDetail;