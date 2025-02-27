import 'module-alias/register';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { routes } from '@auth';
import { swaggerSpec } from '@config/swagger';
import { errorHandler } from '@shared/middleware';
import { API_VERSIONS, API_BASE_PATH } from '@shared/constants';

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${API_BASE_PATH}/${API_VERSIONS.V1}/auth`, routes);

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
