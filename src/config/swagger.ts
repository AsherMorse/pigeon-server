import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import { API_VERSIONS } from '@shared/constants';

dotenv.config();

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Pigeon API',
    version: `${API_VERSIONS.V1}`,
    description: 'API documentation for Pigeon application',
  },
  servers: [
    {
      url: process.env.HOST_URL || 'http://localhost:8080',
      description: 'Server',
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