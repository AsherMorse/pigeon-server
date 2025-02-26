import 'module-alias/register';
import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import "./src/shared/middleware/auth";
import { errorHandler } from "@shared/middleware/errorHandler";
import authRoutes from "@/features/auth/routes";
import { swaggerSpec } from "@config/swagger";

dotenv.config();

const app = express();

const HOST_URL = process.env.HOST_URL || 'http://localhost:3000';
const corsOptions = {
  origin: HOST_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at ${HOST_URL}/api-docs`);
  console.log(`CORS enabled for origin: ${HOST_URL}`);
});
