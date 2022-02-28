const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const qs = require("querystring");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("MAL OAUTH2");
});

const code_challenge = crypto.randomBytes(50).toString("hex");

const getAuthUrl = async () => {
  try {
    const rootUrl = "https://myanimelist.net/v1/oauth2/authorize";
    const options = {
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
app.get("/auth", async (req, res) => {
  console.log(process.env.CLIENT_ID);
  const url = await getAuthUrl();
  res.redirect(url);
});

const getRandomImage = async () => {
  try {
    const manga_id = Math.floor(Math.random() * 100) + 1;
    const rootUrl = `https://api.myanimelist.net/v2/manga/${manga_id}`;
    const headers = {
      "X-MAL-CLIENT-ID": process.env.CLIENT_ID,
    };
    const response = await axios.get(rootUrl, { headers });
    return response.data.main_picture.large;
  } catch (error) {
    return error;
  }
};
app.use(express.static("public"));
app.get("/randomImage.jpg", async (req, res) => {
  const url = await getRandomImage();
  res.send(
    `
    <body style="background-image: url(${url}); background-size: contain; background-repeat:no-repeat;background-position:center">
    </body>
    `
  );
});
const getAccessToken = async (code) => {
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
  } catch (error) {
    return error.response.data;
  }
};

// app.post("/posttest", (req, res) => {
//     const body = req.body
//     res.send(JSON.stringify(body))
// })
app.post("/oauth/token", async (req, res) => {
  const { code, state } = req.body;
  if (state == process.env.STATE_VAR) {
    const token = await getAccessToken(code);
    res.json(token);
  } else {
    res.json({ error: "state not valid" });
  }
});

app.get("/oauth/callback", async (req, res) => {
  res.send("Successfully authenticated");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
