import DataLoader from "dataloader";
import { Manga } from "../entity/Manga";
import { In } from "typeorm";
import { ReadManga } from "../entity/ReadManga";

export const createMangaLoader = new DataLoader<number, Manga[]>(
  async (user_ids) => {
    const users = await ReadManga.find({
      join: {
        alias: "readManga",
        innerJoinAndSelect: {
          manga: "readManga.manga",
        },
      },
      where: {
        user_id: In(user_ids as number[]),
      },
    });
    const userIdToManga: Record<number, Manga[]> = {};

    users.forEach((item) => {
      if (item.user_id in userIdToManga) {
        userIdToManga[item.user_id].push(item.manga);
      } else {
        userIdToManga[item.user_id] = [item.manga];
      }
    });

    return user_ids.map((user_id) => userIdToManga[user_id]);
  }
);
