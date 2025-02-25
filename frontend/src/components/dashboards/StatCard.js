import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <Card className="mb-3">
            <Card.Body className="d-flex align-items-center">
                <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                        backgroundColor: `${color}20`, // 20% opacity
                        width: '50px',
                        height: '50px',
                        color: color
                    }}
                >
                    {icon}
                </div>
                <div>
                    <h6 className="text-muted mb-1">{title}</h6>
                    <h4 className="mb-0">{value}</h4>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatCard;