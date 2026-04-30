import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: "postgresql://postgres:admin@localhost:5436/numdiagcmsdb",
  }),
});
