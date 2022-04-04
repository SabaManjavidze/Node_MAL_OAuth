import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
export const config: PostgresConnectionOptions = {
  type: "postgres",
  host: "ec2-52-30-67-143.eu-west-1.compute.amazonaws.com",
  port: 5432,
  username: "cvcmkgqcpolvsy",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
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
