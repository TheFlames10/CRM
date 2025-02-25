import React from 'react';
import { Table, Badge, Placeholder } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UpcomingActivities = ({ activities, loading }) => {
    if (loading) {
        return (
            <Placeholder as="div" animation="glow">
                <Placeholder xs={12} bg="secondary" style={{ height: '30px', marginBottom: '10px' }} />
                <Placeholder xs={12} bg="secondary" style={{ height: '30px', marginBottom: '10px' }} />
                <Placeholder xs={12} bg="secondary" style={{ height: '30px', marginBottom: '10px' }} />
            </Placeholder>
        );
    }

    if (!activities || activities.length === 0) {
        return <p className="text-muted">No upcoming activities.</p>;
    }

    return (
        <Table responsive>
            <thead>
            <tr>
                <th>Subject</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {activities.slice(0, 5).map((activity) => (
                <tr key={activity.id}>
                    <td>
                        <Link to={`/activities/${activity.id}`}>{activity.subject}</Link>
                    </td>
                    <td>{activity.type}</td>
                    <td>{new Date(activity.scheduledDate).toLocaleDateString()}</td>
                    <td>
                        <Badge bg={activity.status === 'Planned' ? 'warning' : 'success'}>
                            {activity.status}
                        </Badge>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default UpcomingActivities;