import { config } from "dotenv";
config();

const dev_redirect_uri = `http://192.168.0.109:9000/oauth/callback`;
export const redirect_uri =
  process.env.NODE_ENV === "development"
    ? dev_redirect_uri
    : process.env.REDIRECT_URI;

export const app_deep_link = "saba://auth";
export const expo_deep_link = "exp://192.168.0.109:19000/--/auth";
