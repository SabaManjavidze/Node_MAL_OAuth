import axios from "axios";

let app;

const getRandomImage = async () => {
  try {
    const manga_id = Math.floor(Math.random() * 100) + 1;
    const rootUrl = `https://api.myanimelist.net/v2/manga/${manga_id}`;
    const headers = {
      "X-MAL-CLIENT-ID": process.env.CLIENT_ID || "",
    };
    const response = await axios.get(rootUrl, { headers });
    return response.data.main_picture.large;
  } catch (error) {
    return error;
  }
};
// @ts-ignore
app.get("/randomImage.jpg", async (_req: any, res: any) => {
  const url = await getRandomImage();
  res.redirect(url);
});
