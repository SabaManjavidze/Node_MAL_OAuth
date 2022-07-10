import axios from "axios";
import crypto from "crypto";
import qs from "querystring";
import { redirect_uri } from "./variables";

const code_challenge = crypto.randomBytes(50).toString("hex");

export const getAuthUrl = async () => {
  try {
    const rootUrl = "https://myanimelist.net/v1/oauth2/authorize";
    const options: any = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code_challenge: code_challenge,
      response_type: "code",
      state: process.env.STATE_VAR,
    };
    return `${rootUrl}?${new URLSearchParams(options)}`;
  } catch (error) {
    return `There was an error :   ${error}`;
  }
};

export const getAccessToken = async (agent: any, code: string) => {
  try {
    const rootUrl = "https://myanimelist.net/v1/oauth2/token";
    const options = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
      code_verifier: code_challenge,
    };
    const response = await axios.post(rootUrl, qs.stringify(options));
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
