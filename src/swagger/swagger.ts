import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { API_VERSIONS } from '@shared/constants';
import { authComponents } from './authComponents';

dotenv.config();

const HOST_URL = process.env.HOST_URL || 'http://localhost:8080';
const API_VERSION = API_VERSIONS.V1;
const BASE_URL = `${HOST_URL}/${API_VERSION}`;

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Pigeon API',
    version: API_VERSION,
    description:
      'API documentation for Pigeon, a distance-delayed chat app for connecting with friends.',
    license: {
      name: 'MIT License',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: BASE_URL,
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
    ...authComponents,
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints',
    },
  ],
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./src/features/*/routes.ts'],
});

const swaggerUiOptions = {
  customSiteTitle: 'Pigeon API Documentation',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { font-size: 2.5em; }
    .swagger-ui .servers-title { display: block; margin: 20px 0 5px 0; font-size: 1.2em; font-weight: bold; }
    .swagger-ui .servers { padding: 10px; background-color: #f0f0f0; border-radius: 4px; }
    .swagger-ui .info .base-url { font-size: 1.2em; font-weight: bold; display: block; margin: 10px 0; }
  `,
  swaggerOptions: {
    filter: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: -1,
    showExtensions: true,
  },
  explorer: true,
};

export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, swaggerUiOptions);
