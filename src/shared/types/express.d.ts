import type { InferSelectModel } from "drizzle-orm";
import type { users } from "@db/schema";

declare global {
  namespace Express {
    interface User extends InferSelectModel<typeof users> { }
  }
}
