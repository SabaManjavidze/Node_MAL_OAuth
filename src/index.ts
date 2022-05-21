import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "reflect-metadata";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { getAccessToken, getAuthUrl } from "./utils/mal_services";
import { config } from "./ormconfig";
import UserResolver from "./Resolvers/UserResolver";
import MangaResolver from "./Resolvers/MangaResolver";
import { createMangaLoader } from "./utils/MangaLoader";
import ReadMangaResolver from "./Resolvers/ReadMangaResolver";
import { getChapter } from "./utils/getChapter";
import { chapter } from "./routes/chapter";

dotenv.config();
const main = async () => {
  try {
    await createConnection(config);
    console.log("Connected to Postgresql🐘");
  } catch (error) {
    console.log(error);
  }

  const schema = await buildSchema({
    resolvers: [UserResolver, MangaResolver, ReadMangaResolver],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      mangaLoader: createMangaLoader(),
    }),
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    introspection: true,
  });
  await server.start();

  const app = express();
  app.use(bodyParser.json());

  server.applyMiddleware({ app, cors: false });

  //#region ------------------------- Express ---------------------------------------------------

  app.get("/", (_req: Request, res: Response) => {
    res.send("MAL OAUTH2");
  });

  // dev url
  // const redirect_uri = "exp://192.168.0.109:19000/--/auth";
  const redirect_uri_2 = "https://node-mal-oauth.herokuapp.com/oauth/callback";
  // prod url
  const redirect_uri = "saba://auth";

  app.get("/auth", async (_req: Request, res: Response) => {
    const url = await getAuthUrl();
    const redirect_uri_param: string =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        _req.get("user-agent") || ""
      )
        ? redirect_uri
        : redirect_uri_2;
    res.redirect(`${url}&redirect_uri=${redirect_uri_param}`);
  });

  app.get("/chapter/:mangaId/:chapNum", chapter);
  app.post("/oauth/token", async (req: Request, res: Response) => {
    const { code, state } = req.body;
    console.log("body", req.body);
    const agent = req.get("user-agent");
    if (state === process.env.STATE_VAR) {
      const token = await getAccessToken(agent, code);
      console.log("token", token);
      res.json(token);
    } else {
      res.json({ error: "Invalid state" });
    }
  });

  app.get("/oauth/callback", async (_req: Request, res: Response) => {
    res.send("successfully authenticated");
  });

  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}🏃‍`);
  });
  //#endregion
};
main();
