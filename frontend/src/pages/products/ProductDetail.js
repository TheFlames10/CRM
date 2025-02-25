import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { productService } from '../../services/api';
import DeleteConfirmation from '../../components/common/DeleteConfirmation';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductById(id);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        try {
            await productService.deleteProduct(id);
            navigate('/products');
        } catch (error) {
            console.error('Error deleting product', error);
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

    if (!product) {
        return (
            <Container className="text-center p-5">
                <h3>Product not found</h3>
                <Button as={Link} to="/products" variant="primary" className="mt-3">
                    Back to Products
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{product.name}</h1>
                <div>
                    <Button
                        as={Link}
                        to={`/products/${id}/edit`}
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
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Product Details</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <dl>
                                        <dt>Product Code</dt>
                                        <dd>{product.code}</dd>

                                        <dt>Name</dt>
                                        <dd>{product.name}</dd>

                                        <dt>Category</dt>
                                        <dd>{product.category || '-'}</dd>

                                        <dt>List Price</dt>
                                        <dd>{product.listPrice ? `$${product.listPrice.toLocaleString()}` : '-'}</dd>
                                    </dl>
                                </Col>
                                <Col md={6}>
                                    <dl>
                                        <dt>Status</dt>
                                        <dd>
                                            <Badge bg={
                                                product.status === 'Active' ? 'success' :
                                                    product.status === 'Inactive' ? 'secondary' :
                                                        product.status === 'Discontinued' ? 'danger' : 'warning'
                                            }>
                                                {product.status}
                                            </Badge>
                                        </dd>

                                        <dt>Created Date</dt>
                                        <dd>{new Date(product.createdAt).toLocaleDateString()}</dd>

                                        <dt>Last Updated</dt>
                                        <dd>
                                            {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '-'}
                                        </dd>
                                    </dl>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Description</h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="mb-0">{product.description || 'No description available.'}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* This could be used for additional information like product images,
              related products, sales statistics, etc. */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button
                                    variant={product.status === 'Active' ? 'outline-danger' : 'outline-success'}
                                    onClick={async () => {
                                        const newStatus = product.status === 'Active' ? 'Inactive' : 'Active';
                                        try {
                                            await productService.updateProductStatus(id, newStatus);
                                            setProduct({...product, status: newStatus});
                                        } catch (error) {
                                            console.error('Error updating product status', error);
                                        }
                                    }}
                                >
                                    {product.status === 'Active' ? 'Deactivate Product' : 'Activate Product'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <DeleteConfirmation
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete ${product.name} (${product.code})? This action cannot be undone.`}
            />
        </Container>
    );
};

export default ProductDetail;