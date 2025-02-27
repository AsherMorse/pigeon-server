import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import { API_VERSIONS } from '@shared/constants';

dotenv.config();

const HOST_URL = process.env.HOST_URL || 'http://localhost:8080';
const API_VERSION = API_VERSIONS.V1;
const BASE_URL = `${HOST_URL}/${API_VERSION}`;

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Pigeon API',
    version: `${API_VERSION}`,
    description: 'API documentation for Pigeon, a distance-delayed chat app for connecting with friends.',
    license: {
      name: 'MIT License',
      url: 'https://opensource.org/licenses/MIT',
    }
  },
  servers: [
    {
      url: BASE_URL,
      description: `Pigeon API ${API_VERSION}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/features/*/routes.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);