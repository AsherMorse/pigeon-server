import { Request } from 'express';

export interface ProfileDTO {
  userId: string;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProfileDTO {
  userId: string;
  imageUrl?: string | null;
}

export interface UpdateProfileDTO {
  imageUrl?: string | null;
}

export interface UploadImageDTO {
  userId: string;
  file: any; // Use any for now until we add proper multer types
}

export interface DeleteImageDTO {
  userId: string;
}

// User type as expected by the auth system
export interface UserAuth {
  id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean | null;
  tokenVersion: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Extended request with authenticated user
export interface ProfileRequestWithUser extends Request {
  user: UserAuth;
} 