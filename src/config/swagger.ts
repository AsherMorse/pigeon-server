import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';

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
};

const options = {
  swaggerDefinition,
  apis: ['./src/features/*/routes.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
