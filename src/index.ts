import express from "express";
import bodyParser from "body-parser";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { UserResolver, ChapterResolver } from "./Resolvers";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { getAccessToken, getAuthUrl } from "./mal_services";
import { config } from "../ormconfig";
require("dotenv").config({ path: __dirname + "/.env" });

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, ChapterResolver],
  });

  const app = express();
  app.use(bodyParser.json());
  await createConnection(config).then(async () => {
    console.log("Connected to Postgresql🐘");
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await server.start();

  server.applyMiddleware({ app, cors: false });

  //#region ------------------------- Express ---------------------------------------------------

  app.get("/", (_req: express.Request, res: express.Response) => {
    res.send("MAL OAUTH2");
  });

  app.get("/auth", async (_req: express.Request, res: express.Response) => {
    const url = await getAuthUrl();
    res.redirect(url);
  });

  app.post(
    "/oauth/token",
    async (req: express.Request, res: express.Response) => {
      const { code, state } = req.body;
      if (state == process.env.STATE_VAR) {
        const token = await getAccessToken(code);
        res.json(token);
      } else {
        res.json({ error: "Invalid state" });
      }
    }
  );

  app.get(
    "/oauth/callback",
    async (_req: express.Request, res: express.Response) => {
      res.send("successfully authenticated");
    }
  );

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}🏃‍`);
  });
  //#endregion
};
main();
