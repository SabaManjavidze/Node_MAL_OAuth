import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
export const config: PostgresConnectionOptions = {
  type: "postgres",
  host: "ec2-52-30-67-143.eu-west-1.compute.amazonaws.com",
  port: 5432,
  url: "postgres://cvcmkgqcpolvsy:9e8252a041756284737f036c04be82cc253ede4e6e29c83fa7ddb1f7bf4e8372@ec2-52-30-67-143.eu-west-1.compute.amazonaws.com:5432/d3ubmbusnatmjf",
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
