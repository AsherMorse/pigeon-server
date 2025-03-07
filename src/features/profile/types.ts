import type { Request } from 'express';

export interface ProfileDTO {
  id: string;
  userId: string;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Internal DTO that includes imagePath
export interface ProfileInternalDTO extends ProfileDTO {
  imagePath: string | null;
}

export interface CreateProfileDTO {
  userId: string;
  imageUrl?: string | null;
  imagePath?: string | null;
}

export interface UpdateProfileDTO {
  imageUrl?: string | null;
  imagePath?: string | null;
}

export interface DeleteImageDTO {
  userId: string;
}

export type UploadedFile = Express.Multer.File;

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

export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export interface ProfileRequestWithUser extends RequestWithFile {
  user: UserAuth;
}
