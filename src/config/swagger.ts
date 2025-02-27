import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import { API_VERSIONS } from '@shared/constants';

dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Passport Drizzle API',
    version: '1.0.0',
    description: 'API documentation for Express application with Passport and Drizzle ORM',
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
  externalDocs: {
    description: 'API Version Information',
    url: '#api-versions',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/features/*/routes.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

// Add API version information to the Swagger documentation
// Use type assertion to access info property
(swaggerSpec as any).info.description += `\n\n## API Versions\n\n- Current version: ${API_VERSIONS.V1}\n- All endpoints are prefixed with /api/{version}/`;
