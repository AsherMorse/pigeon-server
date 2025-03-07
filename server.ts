import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { routes as authRoutes } from '@auth';
import { routes as profileRoutes } from '@profile';
import { API_VERSIONS } from '@shared/constants';
import { errorHandler } from '@shared/middleware';
import { swaggerUiSetup } from './src/swagger/swagger';

dotenv.config();

const corsOptions = {
  origin: true, // Allow all origins for mobile access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.HOST_URL || 'http://localhost:3000';
const API_VERSION = API_VERSIONS.V1;

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));

app.use(`/${API_VERSION}/auth`, authRoutes);
app.use(`/${API_VERSION}/profile`, profileRoutes);
app.use('/docs', swaggerUi.serve, swaggerUiSetup);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger UI available at ${HOST_URL}/docs`);
});
