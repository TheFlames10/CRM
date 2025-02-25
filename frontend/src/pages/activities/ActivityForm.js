import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { activityService, customerService, contactService, opportunityService } from '../../services/api';

const ActivityForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = Boolean(id);

    const [activity, setActivity] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // If we're coming from related entity pages, we'll have IDs in state
    const initialCustomerId = location.state?.customerId || '';
    const initialContactId = location.state?.contactId || '';
    const initialOpportunityId = location.state?.opportunityId || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch related entities for dropdowns
                const [customersRes, contactsRes, opportunitiesRes] = await Promise.all([
                    customerService.getAllCustomers(),
                    contactService.getAllContacts(),
                    opportunityService.getAllOpportunities(),
                ]);

                setCustomers(customersRes.data);
                setContacts(contactsRes.data);
                setOpportunities(opportunitiesRes.data);

                // If editing, fetch activity data
                if (isEditMode) {
                    const activityResponse = await activityService.getActivityById(id);
                    setActivity(activityResponse.data);
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

    // Format datetime-local input value
    const formatDatetimeLocal = (date) => {
        if (!date) return '';
        const d = new Date(date);
        // Format to YYYY-MM-DDTHH:MM
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };

    const initialValues = {
        subject: activity?.subject || '',
        type: activity?.type || 'Meeting',
        description: activity?.description || '',
        status: activity?.status || 'Planned',
        scheduledDate: activity?.scheduledDate ? formatDatetimeLocal(activity.scheduledDate) : '',
        customer: {
            id: activity?.customer?.id || initialCustomerId
        },
        contact: {
            id: activity?.contact?.id || initialContactId
        },
        opportunity: {
            id: activity?.opportunity?.id || initialOpportunityId
        }
    };

    // Activity type options
    const typeOptions = ['Call', 'Email', 'Meeting', 'Note', 'Task'];

    // Activity status options
    const statusOptions = ['Planned', 'Completed', 'Cancelled'];

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required('Subject is required'),
        type: Yup.string().required('Type is required'),
        description: Yup.string(),
        status: Yup.string().required('Status is required'),
        scheduledDate: Yup.date()
            .typeError('Please enter a valid date and time'),
        customer: Yup.object().shape({
            id: Yup.string()
        }),
        contact: Yup.object().shape({
            id: Yup.string()
        }),
        opportunity: Yup.object().shape({
            id: Yup.string()
        })
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            // Clean up related entity objects if not selected
            if (!values.customer.id) values.customer = null;
            if (!values.contact.id) values.contact = null;
            if (!values.opportunity.id) values.opportunity = null;

            let response;

            if (isEditMode) {
                response = await activityService.updateActivity(id, values);
            } else {
                response = await activityService.createActivity(values);
            }

            navigate(`/activities/${response.data.id}`);
        } catch (error) {
            console.error('Error saving activity', error);
            setError('Failed to save activity. Please try again.');
            setSubmitting(false);
        }
    };

    // Filter contacts based on selected customer
    const handleCustomerChange = (e, setFieldValue) => {
        const customerId = e.target.value;
        setFieldValue('customer.id', customerId);

        // Reset contact if customer changes
        setFieldValue('contact.id', '');

        // TODO: In a real app, you would filter contacts by customer here
        // This would require a separate API call or filtering the existing contacts
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
                <h1>{isEditMode ? 'Edit Activity' : 'New Activity'}</h1>
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
                              isSubmitting,
                              setFieldValue
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Subject*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subject"
                                                value={values.subject}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.subject && errors.subject}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.subject}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Type*</Form.Label>
                                            <Form.Select
                                                name="type"
                                                value={values.type}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.type && errors.type}
                                            >
                                                {typeOptions.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.type}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status*</Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={values.status}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.status && errors.status}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.status}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Scheduled Date and Time</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="scheduledDate"
                                                value={values.scheduledDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.scheduledDate && errors.scheduledDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.scheduledDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Customer</Form.Label>
                                            <Form.Select
                                                name="customer.id"
                                                value={values.customer.id}
                                                onChange={(e) => handleCustomerChange(e, setFieldValue)}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select Customer</option>
                                                {customers.map(customer => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.companyName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact</Form.Label>
                                            <Form.Select
                                                name="contact.id"
                                                value={values.contact.id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select Contact</option>
                                                {contacts.map(contact => (
                                                    <option key={contact.id} value={contact.id}>
                                                        {contact.firstName} {contact.lastName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Opportunity</Form.Label>
                                            <Form.Select
                                                name="opportunity.id"
                                                value={values.opportunity.id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select Opportunity</option>
                                                {opportunities.map(opportunity => (
                                                    <option key={opportunity.id} value={opportunity.id}>
                                                        {opportunity.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.description && errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        as={Link}
                                        to={isEditMode ? `/activities/${id}` : '/activities'}
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

export default ActivityForm;