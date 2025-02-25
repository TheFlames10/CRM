import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { contactService, customerService } from '../../services/api';

const ContactForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = Boolean(id);

    const [contact, setContact] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // If we're coming from customer detail page, we'll have customerId in state
    const initialCustomerId = location.state?.customerId || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch customers for dropdown
                const customersResponse = await customerService.getAllCustomers();
                setCustomers(customersResponse.data);

                // If editing, fetch contact data
                if (isEditMode) {
                    const contactResponse = await contactService.getContactById(id);
                    setContact(contactResponse.data);
                }
            } catch (error) {
                console.error('Error fetching form data', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const initialValues = {
        firstName: contact?.firstName || '',
        lastName: contact?.lastName || '',
        title: contact?.title || '',
        email: contact?.email || '',
        phone: contact?.phone || '',
        mobile: contact?.mobile || '',
        isPrimary: contact?.isPrimary || false,
        notes: contact?.notes || '',
        customer: {
            id: contact?.customer?.id || initialCustomerId
        }
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        title: Yup.string(),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string(),
        mobile: Yup.string(),
        isPrimary: Yup.boolean(),
        notes: Yup.string(),
        customer: Yup.object().shape({
            id: Yup.string()
        })
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            // Clean up customer object if no customer is selected
            if (!values.customer.id) {
                values.customer = null;
            }

            let response;

            if (isEditMode) {
                response = await contactService.updateContact(id, values);
            } else {
                response = await contactService.createContact(values);
            }

            navigate(`/contacts/${response.data.id}`);
        } catch (error) {
            console.error('Error saving contact', error);

            if (error.response?.status === 409) {
                setFieldError('email', 'A contact with this email already exists');
            } else {
                setError('Failed to save contact. Please try again.');
            }

            setSubmitting(false);
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

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{isEditMode ? 'Edit Contact' : 'New Contact'}</h1>
            </div>

            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.firstName && errors.firstName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Last Name*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.lastName && errors.lastName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email*</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.email && errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Company</Form.Label>
                                            <Form.Select
                                                name="customer.id"
                                                value={values.customer.id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select Company</option>
                                                {customers.map(customer => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.companyName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.title && errors.title}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.title}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.phone && errors.phone}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="mobile"
                                                value={values.mobile}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.mobile && errors.mobile}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.mobile}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        id="isPrimary"
                                        name="isPrimary"
                                        label="Primary Contact"
                                        checked={values.isPrimary}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="notes"
                                        value={values.notes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.notes && errors.notes}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        as={Link}
                                        to={isEditMode ? `/contacts/${id}` : '/contacts'}
                                        variant="secondary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ContactForm;