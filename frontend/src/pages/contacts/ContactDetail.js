import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEnvelope, FaPhone, FaMobile } from 'react-icons/fa';
import { contactService, activityService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const ContactDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contact, setContact] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                setLoading(true);
                const contactResponse = await contactService.getContactById(id);
                setContact(contactResponse.data);

                // Fetch related activities
                const activitiesRes = await activityService.getActivitiesByContact(id);
                setActivities(activitiesRes.data);
            } catch (error) {
                console.error('Error fetching contact data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await contactService.deleteContact(id);
            navigate('/contacts');
        } catch (error) {
            console.error('Error deleting contact', error);
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

    if (!contact) {
        return (
            <Container className="text-center p-5">
                <h3>Contact not found</h3>
                <Button as={Link} to="/contacts" variant="primary" className="mt-3">
                    Back to Contacts
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{contact.firstName} {contact.lastName}</h1>
                <div>
                    <Button
                        as={Link}
                        to={`/contacts/${id}/edit`}
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
                            <h5 className="mb-0">Contact Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <dl className="row mb-0">
                                <dt className="col-sm-4">Full Name</dt>
                                <dd className="col-sm-8">{contact.firstName} {contact.lastName}</dd>

                                <dt className="col-sm-4">Company</dt>
                                <dd className="col-sm-8">
                                    {contact.customer ? (
                                        <Link to={`/customers/${contact.customer.id}`}>
                                            {contact.customer.companyName}
                                        </Link>
                                    ) : '-'}
                                </dd>

                                <dt className="col-sm-4">Title</dt>
                                <dd className="col-sm-8">{contact.title || '-'}</dd>

                                <dt className="col-sm-4">Email</dt>
                                <dd className="col-sm-8">
                                    <a href={`mailto:${contact.email}`}>
                                        <FaEnvelope className="me-1" /> {contact.email}
                                    </a>
                                </dd>

                                <dt className="col-sm-4">Phone</dt>
                                <dd className="col-sm-8">
                                    {contact.phone && (
                                        <a href={`tel:${contact.phone}`}>
                                            <FaPhone className="me-1" /> {contact.phone}
                                        </a>
                                    )}
                                </dd>

                                <dt className="col-sm-4">Mobile</dt>
                                <dd className="col-sm-8">
                                    {contact.mobile && (
                                        <a href={`tel:${contact.mobile}`}>
                                            <FaMobile className="me-1" /> {contact.mobile}
                                        </a>
                                    )}
                                </dd>

                                <dt className="col-sm-4">Primary</dt>
                                <dd className="col-sm-8">
                                    {contact.isPrimary ? (
                                        <Badge bg="success">Yes</Badge>
                                    ) : (
                                        <Badge bg="secondary">No</Badge>
                                    )}
                                </dd>

                                <dt className="col-sm-4">Created</dt>
                                <dd className="col-sm-8">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </dd>

                                <dt className="col-sm-4">Last Updated</dt>
                                <dd className="col-sm-8">
                                    {contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : '-'}
                                </dd>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Notes</h5>
                        </Card.Header>
                        <Card.Body>
                            {contact.notes ? (
                                <p>{contact.notes}</p>
                            ) : (
                                <p className="text-muted">No notes available for this contact.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <DeleteConfirmation
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Contact"
                message={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`}
            />
        </Container>
    );
};

export default ContactDetail;