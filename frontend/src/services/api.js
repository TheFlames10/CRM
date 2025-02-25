// src/services/api.js
import axios from 'axios';

const API_URL = '/api';

// Create axios instance with common configuration
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Customer service
export const customerService = {
    getAllCustomers: () => apiClient.get('/customers'),
    getCustomerById: (id) => apiClient.get(`/customers/${id}`),
    searchCustomers: (params) => apiClient.get('/customers/search', { params }),
    createCustomer: (customer) => apiClient.post('/customers', customer),
    updateCustomer: (id, customer) => apiClient.put(`/customers/${id}`, customer),
    deleteCustomer: (id) => apiClient.delete(`/customers/${id}`),
};

// Contact service
export const contactService = {
    getAllContacts: () => apiClient.get('/contacts'),
    getContactById: (id) => apiClient.get(`/contacts/${id}`),
    getContactsByCustomer: (customerId) => apiClient.get(`/contacts/customer/${customerId}`),
    getPrimaryContacts: () => apiClient.get('/contacts/primary'),
    searchContacts: (name) => apiClient.get('/contacts/search', { params: { name } }),
    getContactByEmail: (email) => apiClient.get('/contacts/email', { params: { email } }),
    createContact: (contact) => apiClient.post('/contacts', contact),
    updateContact: (id, contact) => apiClient.put(`/contacts/${id}`, contact),
    deleteContact: (id) => apiClient.delete(`/contacts/${id}`),
};

// Opportunity service
export const opportunityService = {
    getAllOpportunities: () => apiClient.get('/opportunities'),
    getOpportunityById: (id) => apiClient.get(`/opportunities/${id}`),
    getOpportunitiesByCustomer: (customerId) => apiClient.get(`/opportunities/customer/${customerId}`),
    getOpportunitiesByStatus: (status) => apiClient.get(`/opportunities/status/${status}`),
    getOpportunitiesByStage: (stage) => apiClient.get(`/opportunities/stage/${stage}`),
    getOpportunitiesByClosingDateRange: (startDate, endDate) =>
        apiClient.get('/opportunities/closing-date-range', {
            params: { startDate, endDate }
        }),
    getHighValueOpportunities: (threshold) =>
        apiClient.get('/opportunities/high-value', {
            params: { threshold }
        }),
    getTotalOpportunityValueByStatus: (status) =>
        apiClient.get(`/opportunities/value/status/${status}`),
    createOpportunity: (opportunity) => apiClient.post('/opportunities', opportunity),
    updateOpportunity: (id, opportunity) => apiClient.put(`/opportunities/${id}`, opportunity),
    deleteOpportunity: (id) => apiClient.delete(`/opportunities/${id}`),
};

// Activity service
export const activityService = {
    getAllActivities: () => apiClient.get('/activities'),
    getActivityById: (id) => apiClient.get(`/activities/${id}`),
    getActivitiesByCustomer: (customerId) => apiClient.get(`/activities/customer/${customerId}`),
    getActivitiesByContact: (contactId) => apiClient.get(`/activities/contact/${contactId}`),
    getActivitiesByOpportunity: (opportunityId) => apiClient.get(`/activities/opportunity/${opportunityId}`),
    getActivitiesByType: (type) => apiClient.get(`/activities/type/${type}`),
    getActivitiesByStatus: (status) => apiClient.get(`/activities/status/${status}`),
    getActivitiesByDateRange: (startDate, endDate) =>
        apiClient.get('/activities/date-range', {
            params: { startDate, endDate }
        }),
    getRecentActivities: () => apiClient.get('/activities/recent'),
    getUpcomingActivities: () => apiClient.get('/activities/upcoming'),
    createActivity: (activity) => apiClient.post('/activities', activity),
    updateActivity: (id, activity) => apiClient.put(`/activities/${id}`, activity),
    completeActivity: (id) => apiClient.post(`/activities/${id}/complete`),
    deleteActivity: (id) => apiClient.delete(`/activities/${id}`),
};

// Product service
export const productService = {
    getAllProducts: () => apiClient.get('/products'),
    getProductById: (id) => apiClient.get(`/products/${id}`),
    getProductByCode: (code) => apiClient.get(`/products/code/${code}`),
    searchProductsByName: (name) => apiClient.get('/products/search', { params: { name } }),
    getProductsByCategory: (category) => apiClient.get(`/products/category/${category}`),
    getProductsByStatus: (status) => apiClient.get(`/products/status/${status}`),
    getProductsUnderPrice: (maxPrice) =>
        apiClient.get('/products/price/max', {
            params: { maxPrice }
        }),
    getProductsInPriceRange: (minPrice, maxPrice) =>
        apiClient.get('/products/price/range', {
            params: { minPrice, maxPrice }
        }),
    createProduct: (product) => apiClient.post('/products', product),
    updateProduct: (id, product) => apiClient.put(`/products/${id}`, product),
    updateProductStatus: (id, status) =>
        apiClient.patch(`/products/${id}/status`, null, {
            params: { status }
        }),
    deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

// Dashboard service for aggregated data
export const dashboardService = {
    getOpportunitySummary: async () => {
        try {
            const [
                openOpps = { data: [] },
                closedWonOpps = { data: [] },
                closedLostOpps = { data: [] },
                openValue = { data: 0 },
                wonValue = { data: 0 }
            ] = await Promise.all([
                opportunityService.getOpportunitiesByStatus('Open'),
                opportunityService.getOpportunitiesByStatus('Closed Won'),
                opportunityService.getOpportunitiesByStatus('Closed Lost'),
                opportunityService.getTotalOpportunityValueByStatus('Open'),
                opportunityService.getTotalOpportunityValueByStatus('Closed Won')
            ]);

            return {
                counts: {
                    open: openOpps.data.length,
                    won: closedWonOpps.data.length,
                    lost: closedLostOpps.data.length,
                    total: openOpps.data.length + closedWonOpps.data.length + closedLostOpps.data.length
                },
                values: {
                    open: openValue.data,
                    won: wonValue.data
                }
            };
        } catch (error) {
            console.error('Error fetching opportunity summary', error);
            throw error;
        }
    },

    getActivitySummary: async () => {
        try {
            const [
                recentActivities = { data: [] },
                upcomingActivities = { data: [] }
            ] = await Promise.all([
                activityService.getRecentActivities(),
                activityService.getUpcomingActivities()
            ]);

            return {
                recent: recentActivities.data,
                upcoming: upcomingActivities.data
            };
        } catch (error) {
            console.error('Error fetching activity summary', error);
            throw error;
        }
    }
};