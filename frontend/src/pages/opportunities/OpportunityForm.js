import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { opportunityService, customerService } from '../../services/api';

const OpportunityForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = Boolean(id);

    const [opportunity, setOpportunity] = useState(null);
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

                // If editing, fetch opportunity data
                if (isEditMode) {
                    const opportunityResponse = await opportunityService.getOpportunityById(id);
                    setOpportunity(opportunityResponse.data);
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

    const initialValues = {
        name: opportunity?.name || '',
        description: opportunity?.description || '',
        status: opportunity?.status || 'New',
        stage: opportunity?.stage || '',
        amount: opportunity?.amount || '',
        probability: opportunity?.probability || '',
        closingDate: opportunity?.closingDate ? new Date(opportunity.closingDate).toISOString().split('T')[0] : '',
        notes: opportunity?.notes || '',
        customer: {
            id: opportunity?.customer?.id || initialCustomerId
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Opportunity name is required'),
        description: Yup.string(),
        status: Yup.string().required('Status is required'),
        stage: Yup.string(),
        amount: Yup.number()
            .typeError('Amount must be a number')
            .min(0, 'Amount cannot be negative'),
        probability: Yup.number()
            .typeError('Probability must be a number')
            .min(0, 'Probability cannot be negative')
            .max(100, 'Probability cannot exceed 100%'),
        closingDate: Yup.date()
            .typeError('Please enter a valid date'),
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
                response = await opportunityService.updateOpportunity(id, values);
            } else {
                response = await opportunityService.createOpportunity(values);
            }

            navigate(`/opportunities/${response.data.id}`);
        } catch (error) {
            console.error('Error saving opportunity', error);
            setError('Failed to save opportunity. Please try again.');
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
                <h1>{isEditMode ? 'Edit Opportunity' : 'New Opportunity'}</h1>
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
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Opportunity Name*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.name && errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Customer</Form.Label>
                                            <Form.Select
                                                name="customer.id"
                                                value={values.customer.id}
                                                onChange={handleChange}
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
                                </Row>

                                <Row>
                                    <Col md={4}>
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
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Stage</Form.Label>
                                            <Form.Select
                                                name="stage"
                                                value={values.stage}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.stage && errors.stage}
                                            >
                                                <option value="">Select Stage</option>
                                                {stageOptions.map(stage => (
                                                    <option key={stage} value={stage}>{stage}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.stage}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Closing Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="closingDate"
                                                value={values.closingDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.closingDate && errors.closingDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.closingDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Amount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="amount"
                                                value={values.amount}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.amount && errors.amount}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.amount}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Probability (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="probability"
                                                value={values.probability}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.probability && errors.probability}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.probability}
                                            </Form.Control.Feedback>
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
                                        to={isEditMode ? `/opportunities/${id}` : '/opportunities'}
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

export default OpportunityForm;