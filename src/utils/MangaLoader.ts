import DataLoader, { BatchLoadFn } from "dataloader";
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
    const user_idToManga: Record<number, Manga[]> = {};
    users.forEach(async (item) => {
      if (item.user_id in user_idToManga) {
        user_idToManga[item.user_id].push(item.manga);
      } else {
        user_idToManga[item.user_id] = [item.manga];
      }
    });
    return user_ids.map((user_id) => user_idToManga[user_id]);
  }
);
