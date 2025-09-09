// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login/',
    SIGNUP: '/auth/signup/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    RESET_PASSWORD: '/auth/reset-password/',
  },
  
  // Clients
  CLIENTS: {
    LIST: '/clients/',
    CREATE: '/clients/',
    DETAIL: (id: string) => `/clients/${id}/`,
    UPDATE: (id: string) => `/clients/${id}/`,
    DELETE: (id: string) => `/clients/${id}/`,
  },
  
  // POCs
  POCS: {
    LIST: '/clients/poc/',
    CREATE: '/clients/poc/',
    DETAIL: (id: string) => `/clients/poc/${id}/`,
    UPDATE: (id: string) => `/clients/poc/${id}/`,
    DELETE: (id: string) => `/clients/poc/${id}/`,
  },
  
  // Projects
  PROJECTS: {
    LIST: '/projects/',
    CREATE: '/projects/',
    DETAIL: (id: string) => `/projects/${id}/`,
    UPDATE: (id: string) => `/projects/${id}/`,
    DELETE: (id: string) => `/projects/${id}/`,
  },
  
  // Estimations
  ESTIMATIONS: {
    LIST: (projectId: string) => `/project/${projectId}/estimation/`,
    CREATE: '/estimations/',
    UPDATE: (id: string) => `/estimations/${id}/`,
    DELETE: (id: string) => `/estimations/${id}/`,
  },
  
  // Payments
  PAYMENTS: {
    LIST: (projectId: string) => `/project/${projectId}/payments/`,
    CREATE: '/payments/',
    UPDATE: (id: string) => `/payments/${id}/`,
    DELETE: (id: string) => `/payments/${id}/`,
  },
  
  // Holds
  HOLDS: {
    ADD: (projectId: string) => `/projects/${projectId}/add-hold/`,
    RELEASE: (holdId: string) => `/holds/${holdId}/release/`,
  },
  
  // Milestones
  MILESTONES: {
    LIST: '/milestones/',
    CREATE: '/milestones/',
    UPDATE: (id: string) => `/milestones/${id}/`,
    DELETE: (id: string) => `/milestones/${id}/`,
  },
  
  // Additional Requests
  ADDITIONAL_REQUESTS: {
    LIST: '/additional-requests/',
    CREATE: '/additional-requests/',
    APPROVE: (id: string) => `/additional-requests/${id}/approve/`,
    REJECT: (id: string) => `/additional-requests/${id}/reject/`,
  },
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;