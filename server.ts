import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import "./src/shared/middleware/auth";
import { errorHandler } from "./src/shared/middleware/errorHandler";
import authRoutes from "./src/features/auth/routes";
import { swaggerSpec } from "./src/swagger/swagger";

dotenv.config();

const app = express();

// Enable CORS only for HOST_URL
const corsOptions = {
  origin: process.env.HOST_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.HOST_URL || 'http://localhost:3000';
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at ${HOST_URL}/api-docs`);
  console.log(`CORS enabled for origin: ${HOST_URL}`);
});
