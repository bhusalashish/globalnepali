// API Configuration
export const API_BASE_URL = 'http://localhost:8000';

// Helper function to build API URLs
export const buildApiUrl = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
};

// Common headers for API requests
export const getDefaultHeaders = () => ({
    'Content-Type': 'application/json',
});

// API endpoints
export const API_ENDPOINTS = {
    articles: '/api/v1/articles',
    events: '/api/v1/events',
    auth: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
        profile: '/api/v1/auth/profile',
    },
    users: '/api/v1/users',
    volunteers: '/api/v1/volunteers',
    sponsors: '/api/v1/sponsors',
}; 