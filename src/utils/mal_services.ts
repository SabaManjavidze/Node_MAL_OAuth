import axios from "axios";
import crypto from "crypto";
import qs from "querystring";

const code_challenge = crypto.randomBytes(50).toString("hex");
// dev url
// const redirect_uri = "exp://192.168.0.109:19000/--/auth";
const redirect_uri = "https://node-mal-oauth.herokuapp.com/oauth/callback";
// prod url
const redirect_uri_2 = "saba://auth";

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
    // const redirect_uri_param: string =
    //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    //     agent || ""
    //   )
    //     ? redirect_uri
    //     : redirect_uri_2;
    // console.log("redirect_uri", redirect_uri_param);
    const options = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri_2,
      code_verifier: code_challenge,
    };
    console.log("options", options);
    const response = await axios.post(rootUrl, qs.stringify(options));
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
