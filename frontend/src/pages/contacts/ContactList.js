import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { contactService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    // Load contacts
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                let response;

                if (searchTerm) {
                    response = await contactService.searchContacts(searchTerm);
                } else {
                    response = await contactService.getAllContacts();
                }

                setContacts(response.data);
            } catch (error) {
                console.error('Error fetching contacts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [searchTerm]);

    // Handle delete
    const handleDelete = async () => {
        if (!contactToDelete) return;

        try {
            await contactService.deleteContact(contactToDelete.id);
            setContacts(contacts.filter(contact => contact.id !== contactToDelete.id));
            setShowDeleteModal(false);
            setContactToDelete(null);
        } catch (error) {
            console.error('Error deleting contact', error);
        }
    };

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Contacts</h1>
                <Button as={Link} to="/contacts/new" variant="primary">
                    <FaPlus className="me-2" /> Add Contact
                </Button>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search contacts by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                                        Clear
                                    </Button>
                                )}
                            </InputGroup>
                        </Col>
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
                                <th>Name</th>
                                <th>Company</th>
                                <th>Title</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Primary</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No contacts found.
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td>
                                            <Link to={`/contacts/${contact.id}`} className="fw-bold text-decoration-none">
                                                {contact.firstName} {contact.lastName}
                                            </Link>
                                        </td>
                                        <td>
                                            {contact.customer && (
                                                <Link to={`/customers/${contact.customer.id}`}>
                                                    {contact.customer.companyName}
                                                </Link>
                                            )}
                                        </td>
                                        <td>{contact.title || '-'}</td>
                                        <td>
                                            <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                        </td>
                                        <td>{contact.phone || contact.mobile || '-'}</td>
                                        <td>
                                            {contact.isPrimary && (
                                                <Badge bg="success">Primary</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Button
                                                as={Link}
                                                to={`/contacts/${contact.id}/edit`}
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
                                                    setContactToDelete(contact);
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
                title="Delete Contact"
                message={`Are you sure you want to delete ${contactToDelete?.firstName} ${contactToDelete?.lastName}? This action cannot be undone.`}
            />
        </Container>
    );
};

export default ContactList;