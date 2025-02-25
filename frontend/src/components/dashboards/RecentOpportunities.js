import React from 'react';
import { Table, Badge, Placeholder } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecentOpportunities = ({ opportunities, loading }) => {
    // Mock data - in a real app, you'd receive this from props
    const mockOpportunities = [
        { id: 1, name: 'Software License Deal', customer: 'Acme Inc.', amount: 15000, status: 'Qualified' },
        { id: 2, name: 'Consulting Services', customer: 'XYZ Corp', amount: 35000, status: 'Proposal' },
        { id: 3, name: 'Maintenance Contract', customer: 'Global Systems', amount: 12000, status: 'Negotiation' },
        { id: 4, name: 'Hardware Upgrade', customer: 'Local Shop', amount: 8000, status: 'New' },
        { id: 5, name: 'Cloud Migration', customer: 'Beta Solutions', amount: 45000, status: 'Qualified' }
    ];

    if (loading) {
        return (
            <Placeholder as="div" animation="glow">
                <Placeholder xs={12} bg="secondary" style={{ height: '30px', marginBottom: '10px' }} />
                <Placeholder xs={12} bg="secondary" style={{ height: '30px', marginBottom: '10px' }} />
                <Placeholder xs={12} bg="secondary" style={{ height: '30px', marginBottom: '10px' }} />
            </Placeholder>
        );
    }

    return (
        <Table responsive>
            <thead>
            <tr>
                <th>Name</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {mockOpportunities.map((opp) => (
                <tr key={opp.id}>
                    <td>
                        <Link to={`/opportunities/${opp.id}`}>{opp.name}</Link>
                    </td>
                    <td>{opp.customer}</td>
                    <td>${opp.amount.toLocaleString()}</td>
                    <td>
                        <Badge bg={
                            opp.status === 'New' ? 'info' :
                                opp.status === 'Qualified' ? 'primary' :
                                    opp.status === 'Proposal' ? 'warning' :
                                        opp.status === 'Negotiation' ? 'danger' : 'success'
                        }>
                            {opp.status}
                        </Badge>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default RecentOpportunities;