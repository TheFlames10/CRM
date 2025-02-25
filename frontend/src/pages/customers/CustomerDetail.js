import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Nav, Tab, Spinner, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUserTie, FaHandshake, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { customerService, contactService, opportunityService, activityService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const customerResponse = await customerService.getCustomerById(id);
                setCustomer(customerResponse.data);

                // Fetch related data
                const [contactsRes, opportunitiesRes, activitiesRes] = await Promise.all([
                    contactService.getContactsByCustomer(id),
                    opportunityService.getOpportunitiesByCustomer(id),
                    activityService.getActivitiesByCustomer(id)
                ]);

                setContacts(contactsRes.data);
                setOpportunities(opportunitiesRes.data);
                setActivities(activitiesRes.data);
            } catch (error) {
                console.error('Error fetching customer data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await customerService.deleteCustomer(id);
            navigate('/customers');
        } catch (error) {
            console.error('Error deleting customer', error);
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

    if (!customer) {
        return (
            <Container className="text-center p-5">
                <h3>Customer not found</h3>
                <Button as={Link} to="/customers" variant="primary" className="mt-3">
                    Back to Customers
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{customer.companyName}</h1>
                <div>
                    <Button
                        as={Link}
                        to={`/customers/${id}/edit`}
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
                            <h5 className="mb-0">Company Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <dl className="row mb-0">
                                <dt className="col-sm-4">Status</dt>
                                <dd className="col-sm-8">
                                    <Badge bg={
                                        customer.status === 'Active' ? 'success' :
                                            customer.status === 'Inactive' ? 'secondary' :
                                                customer.status === 'Prospect' ? 'info' : 'warning'
                                    }>
                                        {customer.status}
                                    </Badge>
                                </dd>

                                <dt className="col-sm-4">Industry</dt>
                                <dd className="col-sm-8">{customer.industry || '-'}</dd>

                                <dt className="col-sm-4">Website</dt>
                                <dd className="col-sm-8">
                                    {customer.website ? (
                                        <a href={customer.website} target="_blank" rel="noopener noreferrer">
                                            {customer.website}
                                        </a>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Created</dt>
                                <dd className="col-sm-8">
                                    {new Date(customer.createdAt).toLocaleDateString()}
                                </dd>

                                <dt className="col-sm-4">Last Updated</dt>
                                <dd className="col-sm-8">
                                    {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : '-'}
                                </dd>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Tab.Container defaultActiveKey="contacts">
                        <Card>
                            <Card.Header>
                                <Nav variant="tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="contacts">
                                            <FaUserTie className="me-2" /> Contacts ({contacts.length})
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="opportunities">
                                            <FaHandshake className="me-2" /> Opportunities ({opportunities.length})
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="activities">
                                            <FaCalendarAlt className="me-2" /> Activities ({activities.length})
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="contacts">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button
                                                as={Link}
                                                to="/contacts/new"
                                                state={{ customerId: id }}
                                                variant="primary"
                                                size="sm"
                                            >
                                                <FaPlus className="me-1" /> Add Contact
                                            </Button>
                                        </div>
                                        {contacts.length === 0 ? (
                                            <p className="text-center py-3">No contacts found for this customer.</p>
                                        ) : (
                                            <Table responsive hover>
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Title</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Primary</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {contacts.map((contact) => (
                                                    <tr key={contact.id}>
                                                        <td>
                                                            <Link to={`/contacts/${contact.id}`}>
                                                                {contact.firstName} {contact.lastName}
                                                            </Link>
                                                        </td>
                                                        <td>{contact.title || '-'}</td>
                                                        <td>{contact.email}</td>
                                                        <td>{contact.phone || contact.mobile || '-'}</td>
                                                        <td>
                                                            {contact.isPrimary && (
                                                                <Badge bg="success">Primary</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="opportunities">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button
                                                as={Link}
                                                to="/opportunities/new"
                                                state={{ customerId: id }}
                                                variant="primary"
                                                size="sm"
                                            >
                                                <FaPlus className="me-1" /> Add Opportunity
                                            </Button>
                                        </div>
                                        {opportunities.length === 0 ? (
                                            <p className="text-center py-3">No opportunities found for this customer.</p>
                                        ) : (
                                            <Table responsive hover>
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Status</th>
                                                    <th>Amount</th>
                                                    <th>Closing Date</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {opportunities.map((opportunity) => (
                                                    <tr key={opportunity.id}>
                                                        <td>
                                                            <Link to={`/opportunities/${opportunity.id}`}>
                                                                {opportunity.name}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <Badge bg={
                                                                opportunity.status === 'New' ? 'info' :
                                                                    opportunity.status === 'Qualified' ? 'primary' :
                                                                        opportunity.status === 'Proposal' ? 'warning' :
                                                                            opportunity.status === 'Negotiation' ? 'danger' :
                                                                                opportunity.status === 'Closed Won' ? 'success' : 'secondary'
                                                            }>
                                                                {opportunity.status}
                                                            </Badge>
                                                        </td>
                                                        <td>${opportunity.amount?.toLocaleString() || '-'}</td>
                                                        <td>
                                                            {opportunity.closingDate ?
                                                                new Date(opportunity.closingDate).toLocaleDateString() : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="activities">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button
                                                as={Link}
                                                to="/activities/new"
                                                state={{ customerId: id }}
                                                variant="primary"
                                                size="sm"
                                            >
                                                <FaPlus className="me-1" /> Add Activity
                                            </Button>
                                        </div>
                                        {activities.length === 0 ? (
                                            <p className="text-center py-3">No activities found for this customer.</p>
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
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
            </Row>

            <DeleteConfirmation
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Customer"
                message={`Are you sure you want to delete ${customer.companyName}? This will also delete all associated contacts, opportunities, and activities. This action cannot be undone.`}
            />
        </Container>
    );
};

export default CustomerDetail;