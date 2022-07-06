import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import dotenv from "dotenv";
dotenv.config();
export const config: PostgresConnectionOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL || "",
  synchronize: true,
  logging: false,
  entities: [
    "./entity/**/*.ts",
    "./entity/**/*.js",
    `${__dirname}/entity/**/*.ts`,
    `${__dirname}/entity/**/*.js`,
  ],
  migrations: ["./migration/**/*.ts", "./migration/**/*.js"],
  subscribers: ["./subscriber/**/*.ts", "./subscriber/**/*.js"],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
