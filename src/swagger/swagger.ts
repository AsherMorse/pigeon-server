import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { API_VERSIONS } from '@shared/constants';
import { authComponents } from './authComponents';
import { coreComponents } from './coreComponents';
import { profileComponents } from './profileComponents';

dotenv.config();

const API_VERSION = API_VERSIONS.V1;

const swaggerDefinition = {
  openapi: '3.0.0',
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
      url: API_VERSION,
    },
  ],
  components: {
    schemas: {
      ...coreComponents.schemas,
      ...authComponents.schemas,
      ...profileComponents.schemas,
    },
    responses: coreComponents.responses,
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
    {
      name: 'Profile',
      description: 'User profile management endpoints',
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
