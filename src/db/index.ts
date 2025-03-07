import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { refreshTokens, users, profiles } from '@db/schema';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { users, refreshTokens, profiles },
});
