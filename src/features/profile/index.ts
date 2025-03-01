import { Request, Response } from 'express';
export { routes } from './routes';
export * from './types';

export const controller = {
  getProfile: async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Not implemented yet' });
  },
  getUserProfile: async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Not implemented yet' });
  },
  uploadProfileImage: async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Not implemented yet' });
  },
  deleteProfileImage: async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Not implemented yet' });
  }
};

export const service = {};

export const validator = {};

export const profileRepository = {};