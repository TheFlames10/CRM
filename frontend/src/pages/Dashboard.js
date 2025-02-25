import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    FaUsers,
    FaHandshake,
    FaCalendarAlt,
    FaBoxOpen,
    FaDollarSign
} from 'react-icons/fa';
import { customerService, productService, opportunityService, activityService, contactService } from '../services/api';

// Components
import StatCard from '../components/dashboards/StatCard';
import UpcomingActivities from '../components/dashboards/UpcomingActivities';
import RecentOpportunities from '../components/dashboards/RecentOpportunities';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        customers: 0,
        contacts: 0,
        opportunities: 0,
        activities: 0,
        products: 0
    });
    const [opportunitySummary, setOpportunitySummary] = useState({
        counts: { open: 0, won: 0, lost: 0, total: 0 },
        values: { open: 0, won: 0 }
    });
    const [activitySummary, setActivitySummary] = useState({
        recent: [],
        upcoming: []
    });
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch real data from API endpoints
                const [customersResponse, contactsResponse, productsResponse,
                    opportunitiesResponse, activitiesResponse] = await Promise.all([
                    customerService.getAllCustomers(),
                    contactService.getAllContacts(),
                    productService.getAllProducts(),
                    opportunityService.getAllOpportunities(),
                    activityService.getAllActivities()
                ]);

                // Get upcoming activities
                const upcomingActivitiesResponse = await activityService.getUpcomingActivities();

                // Get recent activities
                const recentActivitiesResponse = await activityService.getRecentActivities();

                // Calculate open opportunities and closed won opportunities
                const openOpportunities = opportunitiesResponse.data.filter(
                    opp => opp.status !== 'Closed Won' && opp.status !== 'Closed Lost'
                );
                const wonOpportunities = opportunitiesResponse.data.filter(
                    opp => opp.status === 'Closed Won'
                );
                const lostOpportunities = opportunitiesResponse.data.filter(
                    opp => opp.status === 'Closed Lost'
                );

                // Calculate pipeline value (sum of open opportunity amounts)
                const openValue = openOpportunities.reduce(
                    (sum, opp) => sum + (opp.amount || 0), 0
                );
                const wonValue = wonOpportunities.reduce(
                    (sum, opp) => sum + (opp.amount || 0), 0
                );

                // Update stats with real counts
                setStats({
                    customers: customersResponse.data.length,
                    contacts: contactsResponse.data.length,
                    opportunities: opportunitiesResponse.data.length,
                    activities: activitiesResponse.data.length,
                    products: productsResponse.data.length
                });

                // Update opportunity summary
                setOpportunitySummary({
                    counts: {
                        open: openOpportunities.length,
                        won: wonOpportunities.length,
                        lost: lostOpportunities.length,
                        total: opportunitiesResponse.data.length
                    },
                    values: {
                        open: openValue,
                        won: wonValue
                    }
                });

                // Update activity summary
                setActivitySummary({
                    recent: recentActivitiesResponse.data || [],
                    upcoming: upcomingActivitiesResponse.data || []
                });

                // Create sales data from opportunities (grouped by month)
                const salesByMonth = opportunitiesResponse.data
                    .filter(opp => opp.status === 'Closed Won')
                    .reduce((acc, opp) => {
                        if (!opp.closingDate) return acc;
                        const date = new Date(opp.closingDate);
                        const month = date.toLocaleString('default', { month: 'short' });
                        if (!acc[month]) acc[month] = 0;
                        acc[month] += opp.amount || 0;
                        return acc;
                    }, {});

                const salesDataArray = Object.entries(salesByMonth).map(
                    ([name, value]) => ({ name, value })
                );

                setSalesData(salesDataArray.length > 0 ? salesDataArray : [
                    { name: 'Jan', value: 0 },
                    { name: 'Feb', value: 0 },
                    { name: 'Mar', value: 0 }
                ]);

            } catch (error) {
                console.error('Error fetching dashboard data', error);
                // Fallback to empty data if API calls fail
                setOpportunitySummary({
                    counts: { open: 0, won: 0, lost: 0, total: 0 },
                    values: { open: 0, won: 0 }
                });
                setActivitySummary({
                    recent: [],
                    upcoming: []
                });
                setSalesData([
                    { name: 'Jan', value: 0 },
                    { name: 'Feb', value: 0 },
                    { name: 'Mar', value: 0 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Data for pie chart
    const opportunityStatusData = [
        { name: 'Open', value: opportunitySummary.counts.open },
        { name: 'Won', value: opportunitySummary.counts.won },
        { name: 'Lost', value: opportunitySummary.counts.lost }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="dashboard">
            <h1 className="mb-4">Dashboard</h1>

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={4} lg>
                    <StatCard
                        title="Customers"
                        value={stats.customers}
                        icon={<FaUsers />}
                        color="#007bff"
                    />
                </Col>
                <Col md={4} lg>
                    <StatCard
                        title="Opportunities"
                        value={stats.opportunities}
                        icon={<FaHandshake />}
                        color="#28a745"
                    />
                </Col>
                <Col md={4} lg>
                    <StatCard
                        title="Activities"
                        value={stats.activities}
                        icon={<FaCalendarAlt />}
                        color="#ffc107"
                    />
                </Col>
                <Col md={4} lg>
                    <StatCard
                        title="Products"
                        value={stats.products}
                        icon={<FaBoxOpen />}
                        color="#6f42c1"
                    />
                </Col>
                <Col md={4} lg>
                    <StatCard
                        title="Pipeline Value"
                        value={`$${opportunitySummary.values.open.toLocaleString()}`}
                        icon={<FaDollarSign />}
                        color="#fd7e14"
                    />
                </Col>
            </Row>

            {/* Charts & Graphs */}
            <Row className="mb-4">
                <Col lg={8}>
                    <Card className="h-100">
                        <Card.Header>
                            <h5 className="mb-0">Monthly Sales</h5>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                                    <Legend />
                                    <Bar dataKey="value" fill="#007bff" name="Sales" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="h-100">
                        <Card.Header>
                            <h5 className="mb-0">Opportunity Status</h5>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={opportunityStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {opportunityStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Count']} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="d-flex justify-content-around w-100 mt-3">
                                {opportunityStatusData.map((entry, index) => (
                                    <div key={`legend-${index}`} className="d-flex align-items-center">
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: COLORS[index % COLORS.length],
                                                marginRight: '5px',
                                                borderRadius: '2px'
                                            }}
                                        />
                                        <span>{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Activity & Opportunity Lists */}
            <Row>
                <Col lg={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Upcoming Activities</h5>
                        </Card.Header>
                        <Card.Body>
                            <UpcomingActivities activities={activitySummary.upcoming} loading={loading} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Recent Opportunities</h5>
                        </Card.Header>
                        <Card.Body>
                            <RecentOpportunities opportunities={opportunitySummary.counts.open} loading={loading} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;