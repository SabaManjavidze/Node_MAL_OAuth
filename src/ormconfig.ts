import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import dotenv from "dotenv";
dotenv.config();
export const config: PostgresConnectionOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL || "",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
