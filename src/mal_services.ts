import axios from "axios";
import crypto from "crypto";
import qs from "querystring";

const code_challenge = crypto.randomBytes(50).toString("hex");

export const getAuthUrl = async () => {
  try {
    const rootUrl = "https://myanimelist.net/v1/oauth2/authorize";
    const options: any = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code_challenge: code_challenge,
      response_type: "code",
      redirect_uri: "http://localhost:3000/oauth/callback",
      state: process.env.STATE_VAR,
    };
    return `${rootUrl}?${new URLSearchParams(options)}`;
  } catch (error) {
    return error;
  }
};

export const getAccessToken = async (code: string) => {
  try {
    const rootUrl = "https://myanimelist.net/v1/oauth2/token";
    const options = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/oauth/callback",
      code_verifier: code_challenge,
    };
    const response = await axios.post(rootUrl, qs.stringify(options));
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
