import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { customerService } from '../../services/api';

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                const response = await customerService.getCustomerById(id);
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer', error);
                setError('Failed to load customer data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id, isEditMode]);

    const initialValues = {
        companyName: customer?.companyName || '',
        industry: customer?.industry || '',
        website: customer?.website || '',
        status: customer?.status || 'Prospect'
    };

    const validationSchema = Yup.object().shape({
        companyName: Yup.string().required('Company name is required'),
        industry: Yup.string(),
        website: Yup.string().url('Please enter a valid URL'),
        status: Yup.string().required('Status is required')
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            let response;

            if (isEditMode) {
                response = await customerService.updateCustomer(id, values);
            } else {
                response = await customerService.createCustomer(values);
            }

            navigate(`/customers/${response.data.id}`);
        } catch (error) {
            console.error('Error saving customer', error);

            if (error.response?.status === 409) {
                setFieldError('companyName', 'A customer with this name already exists');
            } else {
                setError('Failed to save customer. Please try again.');
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
                <h1>{isEditMode ? 'Edit Customer' : 'New Customer'}</h1>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Company Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companyName"
                                        value={values.companyName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.companyName && errors.companyName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.companyName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Industry</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="industry"
                                        value={values.industry}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.industry && errors.industry}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.industry}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="website"
                                        value={values.website}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.website && errors.website}
                                        placeholder="https://example.com"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.website}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Status*</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={values.status}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.status && errors.status}
                                    >
                                        <option value="Prospect">Prospect</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.status}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        as={Link}
                                        to={isEditMode ? `/customers/${id}` : '/customers'}
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

export default CustomerForm;