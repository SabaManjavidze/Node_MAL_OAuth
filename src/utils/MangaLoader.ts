import DataLoader from "dataloader";
import { Manga } from "../entity/Manga";
import { In } from "typeorm";
import { ReadManga } from "../entity/ReadManga";
import { UserManga } from "src/types/UserManga";

export const createMangaLoader = () =>
  new DataLoader<number, UserManga[]>(async (user_ids) => {
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
    const userIdToManga: Record<number, UserManga[]> = {};

    users.forEach((item) => {
      if (item.user_id in userIdToManga) {
        userIdToManga[item.user_id].push({
          manga_details: item.manga,
          read_date: item.read_date,
          last_read_chapter: item.last_read_chapter,
        });
      } else {
        userIdToManga[item.user_id] = [
          {
            manga_details: item.manga,
            read_date: item.read_date,
            last_read_chapter: item.last_read_chapter,
          },
        ];
      }
    });

    return user_ids.map((user_id) => userIdToManga[user_id]);
  });
