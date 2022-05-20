import axios from "axios";

export const getChapter = async (mangaId: string, chapNum: string) => {
  const url = `${process.env.API_URL}/manga/${mangaId}/${chapNum}`;
  const { data } = await axios.get(url);
  return data;
};
