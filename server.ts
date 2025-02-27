import 'module-alias/register';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { routes as authRoutes } from '@auth';
import { swaggerSpec } from '@config/swagger';
import { errorHandler } from '@shared/middleware';
import { API_VERSIONS } from '@shared/constants';

dotenv.config();

const app = express();

const HOST_URL = process.env.HOST_URL || 'http://localhost:3000';
const corsOptions = {
  origin: HOST_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

const swaggerUiOptions = {
  customSiteTitle: 'Pigeon API Documentation',
  customCss: `
    .topbar-wrapper img { content:url('https://via.placeholder.com/150x50?text=Pigeon'); max-height: 50px; }
    .swagger-ui .info .title { font-size: 2.5em; }
    .swagger-ui .info .base-url { font-size: 1.2em; font-weight: bold; display: block; margin: 10px 0; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .scheme-container { padding: 15px 0; }
    .swagger-ui .opblock .opblock-summary-method { border-radius: 4px; }
    .swagger-ui .opblock { border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
  `,
  swaggerOptions: {
    filter: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: 0,
    showExtensions: true,
  },
  explorer: true,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use(`/${API_VERSIONS.V1}/auth`, authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger UI available at ${HOST_URL}/api-docs`);
  // eslint-disable-next-line no-console
  console.log(`CORS enabled for origin: ${HOST_URL}`);
});
