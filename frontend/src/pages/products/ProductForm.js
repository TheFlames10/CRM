import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { productService } from '../../services/api';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                const response = await productService.getProductById(id);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product', error);
                setError('Failed to load product data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, isEditMode]);

    const initialValues = {
        code: product?.code || '',
        name: product?.name || '',
        description: product?.description || '',
        listPrice: product?.listPrice || '',
        category: product?.category || '',
        status: product?.status || 'Active'
    };

    const validationSchema = Yup.object().shape({
        code: Yup.string().required('Product code is required'),
        name: Yup.string().required('Product name is required'),
        description: Yup.string(),
        listPrice: Yup.number()
            .typeError('Price must be a number')
            .min(0, 'Price cannot be negative'),
        category: Yup.string(),
        status: Yup.string().required('Status is required')
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            let response;

            if (isEditMode) {
                response = await productService.updateProduct(id, values);
            } else {
                response = await productService.createProduct(values);
            }

            navigate(`/products/${response.data.id}`);
        } catch (error) {
            console.error('Error saving product', error);

            if (error.response?.status === 409) {
                setFieldError('code', 'A product with this code already exists');
            } else {
                setError('Failed to save product. Please try again.');
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
                <h1>{isEditMode ? 'Edit Product' : 'New Product'}</h1>
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
                                            <Form.Label>Product Code*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="code"
                                                value={values.code}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.code && errors.code}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.code}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Product Name*</Form.Label>
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

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>List Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                name="listPrice"
                                                value={values.listPrice}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.listPrice && errors.listPrice}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.listPrice}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="category"
                                                value={values.category}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.category && errors.category}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

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
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Discontinued">Discontinued</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.status}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        as={Link}
                                        to={isEditMode ? `/products/${id}` : '/products'}
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

export default ProductForm;