import { Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/customers/CustomerList';
import CustomerDetail from './pages/customers/CustomerDetail';
import CustomerForm from './pages/customers/CustomerForm';
import ContactList from './pages/contacts/ContactList';
import ContactDetail from './pages/contacts/ContactDetail';
import ContactForm from './pages/contacts/ContactForm';
import OpportunityList from './pages/opportunities/OpportunityList';
import OpportunityDetail from './pages/opportunities/OpportunityDetail';
import OpportunityForm from './pages/opportunities/OpportunityForm';
import ActivityList from './pages/activities/ActivityList';
import ActivityDetail from './pages/activities/ActivityDetail';
import ActivityForm from './pages/activities/ActivityForm';
import ProductList from './pages/products/ProductList';
import ProductDetail from './pages/products/ProductDetail';
import ProductForm from './pages/products/ProductForm';
import NotFound from './pages/NotFound';

const routes = [
    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/customers',
        children: [
            { path: '', element: <CustomerList /> },
            { path: 'new', element: <CustomerForm /> },
            { path: ':id', element: <CustomerDetail /> },
            { path: ':id/edit', element: <CustomerForm /> }
        ]
    },
    {
        path: '/contacts',
        children: [
            { path: '', element: <ContactList /> },
            { path: 'new', element: <ContactForm /> },
            { path: ':id', element: <ContactDetail /> },
            { path: ':id/edit', element: <ContactForm /> }
        ]
    },
    {
        path: '/opportunities',
        children: [
            { path: '', element: <OpportunityList /> },
            { path: 'new', element: <OpportunityForm /> },
            { path: ':id', element: <OpportunityDetail /> },
            { path: ':id/edit', element: <OpportunityForm /> }
        ]
    },
    {
        path: '/activities',
        children: [
            { path: '', element: <ActivityList /> },
            { path: 'new', element: <ActivityForm /> },
            { path: ':id', element: <ActivityDetail /> },
            { path: ':id/edit', element: <ActivityForm /> }
        ]
    },
    {
        path: '/products',
        children: [
            { path: '', element: <ProductList /> },
            { path: 'new', element: <ProductForm /> },
            { path: ':id', element: <ProductDetail /> },
            { path: ':id/edit', element: <ProductForm /> }
        ]
    },
    {
        path: '404',
        element: <NotFound />
    },
    {
        path: '*',
        element: <Navigate to="404" />
    }
];

export default routes;