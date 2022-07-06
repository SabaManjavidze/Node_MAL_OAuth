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
import { app_deep_link, expo_deep_link, redirect_uri } from "./utils/variables";

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
  // get current url

  // prod url

  app.get("/auth", async (_req: Request, res: Response) => {
    const url = await getAuthUrl();
    // console.log("first");
    console.log(redirect_uri);
    res.redirect(`${url}&redirect_uri=${redirect_uri}`);
  });

  app.get("/chapter/:mangaId/:chapNum", chapter);

  app.post("/oauth/token", async (req: Request, res: Response) => {
    const { code, state } = req.body;
    // console.log("body", req.body);
    const agent = req.get("user-agent");
    if (state === process.env.STATE_VAR) {
      const token = await getAccessToken(agent, code);
      // console.log("token", token);
      res.json(token);
    } else {
      res.json({ error: "Invalid state" });
    }
  });

  app.get("/oauth/callback", async (req: Request, res: Response) => {
    const { code, state } = req.query;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        req.get("user-agent") || ""
      )
    ) {
      const mobile_link =
        process.env.NODE_ENV === "production" ? app_deep_link : expo_deep_link;
      const mobile_redirect = `${mobile_link}?code=${code}&state=${state}`;
      res.redirect(mobile_redirect);
      return;
    }

    res.send("Please use a mobile device");
  });

  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}🏃‍`);
  });
  //#endregion
};
main();
