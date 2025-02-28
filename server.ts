import 'module-alias/register';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { routes as authRoutes } from '@auth';
import { swaggerUiSetup } from '@/swagger/swagger';
import { API_VERSIONS } from '@shared/constants';
import { errorHandler } from '@shared/middleware';

dotenv.config();

const app = express();

const corsOptions = {
  origin: true, // Allow mobile origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use('/docs', swaggerUi.serve, swaggerUiSetup);

app.use(`/${API_VERSIONS.V1}/auth`, authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.HOST_URL || 'http://localhost:3000';
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger UI available at ${HOST_URL}/docs`);
});
