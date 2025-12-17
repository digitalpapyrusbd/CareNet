import { setupServer } from 'msw';
import { handlers } from './handlers';

// Setup mock server with handlers for Node.js (Jest) environment
export const server = setupServer(...handlers);
