import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '@config/database';
import { AppError } from '@shared/middleware/errorHandler';
import { users } from '@db/schema';
import type { TokenPayload } from '@auth';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
};

passport.use(
  new JwtStrategy(options, async (payload: TokenPayload, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      });

      if (!user) {
        return done(null, false);
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return done(new AppError(401, 'Token invalidated', undefined, 'INVALID_TOKEN'), false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: Express.User | false) => {
      if (err) {
        if (err instanceof AppError) {
          return next(err);
        }
        return next(new AppError(500, 'Internal server error', undefined, 'INTERNAL_ERROR'));
      }

      if (!user) {
        return next(new AppError(401, 'Unauthorized', undefined, 'UNAUTHORIZED'));
      }

      req.user = user;
      next();
    },
  )(req, res, next);
};
