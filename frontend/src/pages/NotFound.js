import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container className="text-center my-5">
            <Row>
                <Col>
                    <h1 className="display-1">404</h1>
                    <h2>Page Not Found</h2>
                    <p className="lead">The page you are looking for does not exist.</p>
                    <Button as={Link} to="/" variant="primary">
                        Return to Dashboard
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;