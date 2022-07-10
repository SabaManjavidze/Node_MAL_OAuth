import { Users } from "../entity/Users";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { ReadManga } from "../entity/ReadManga";
import { Manga } from "../entity/Manga";

@InputType()
class ReadMangaInput {
  @Field()
  user_id: number;
  @Field({ nullable: true })
  manga_id: string;
}

@Resolver()
export default class ReadMangaResolver {
  // INSERT INTO READ_MANGA
  @Mutation(() => Boolean)
  async removeReadManga(
    @Arg("options", () => ReadMangaInput) options: ReadMangaInput
  ) {
    const { user_id, manga_id } = options;

    if (manga_id) {
      const ids = await ReadManga.find({ where: { user_id, manga_id } });
      await ids[0].remove();
      return true;
    }

    const ids = await ReadManga.find({ where: { user_id } });
    ids.map(async (item) => await item.remove());
    return true;
  }

  @Mutation(() => Boolean)
  async createReadManga(
    @Arg("options", () => ReadMangaInput) options: ReadMangaInput,
    @Arg("read_date", { nullable: true }) read_date: string,
    @Arg("last_read_chapter", { nullable: true }) last_read_chapter: string,
    @Arg("title") title: string,
    @Arg("img_url") img_url: string
  ) {
    const { user_id, manga_id } = options;
    const now_date = read_date
      ? read_date
      : new Date().toLocaleTimeString("en-us", {
          year: "numeric",
          month: "2-digit",
          day: "numeric",
          hour: "numeric",
          hourCycle: "h24",
          minute: "numeric",
          second: "numeric",
        });
    const rm_exists = await ReadManga.find({ where: { user_id, manga_id } });
    const manga_exists = await Manga.find({ where: { manga_id } });
    if (!manga_exists[0]) {
      Manga.insert({
        title,
        img_url,
        manga_id,
      });
    }
    if (rm_exists[0]) {
      if (last_read_chapter && read_date) {
        await ReadManga.update(
          { user_id, manga_id },
          { read_date, last_read_chapter }
        );
        return true;
      } else if (last_read_chapter) {
        await ReadManga.update({ user_id, manga_id }, { last_read_chapter });
        return true;
      } else if (read_date) {
        await ReadManga.update({ user_id, manga_id }, { read_date });
        return true;
      }
      return false;
    }
    await ReadManga.insert({
      manga_id,
      user_id,
      read_date: now_date,
      last_read_chapter: last_read_chapter,
    });
    return true;
  }
  @Mutation(() => Boolean)
  async updateReadManga(
    @Arg("options", () => ReadMangaInput) options: ReadMangaInput,
    @Arg("read_date", () => String, { nullable: true }) read_date: string,
    @Arg("last_chapter_read", () => Int, { nullable: true })
    last_read_chapter: number
  ) {
    const { user_id, manga_id } = options;
    return false;
  }

  @Query(() => [ReadManga])
  async getReadManga(
    @Arg("options", () => ReadMangaInput, { nullable: true })
    options: ReadMangaInput
  ) {
    if (options) {
      const { user_id, manga_id } = options;
      if (manga_id) {
        const ids = await ReadManga.find({ where: { user_id, manga_id } });
        return ids;
      }

      const ids = await ReadManga.find({ where: { user_id } });
      return ids;
    }
    return await ReadManga.find();
  }
}
