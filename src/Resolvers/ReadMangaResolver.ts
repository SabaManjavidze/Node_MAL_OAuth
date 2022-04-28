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
  async createReadManga(
    @Arg("user_id", () => Int) user_id: number,
    @Arg("manga_id") manga_id: string,
    @Arg("read_date", { nullable: true }) read_date: string,
    @Arg("last_chapter_read", () => Int, { nullable: true })
    last_chapter_read: number
  ) {
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
    await ReadManga.insert({
      manga_id,
      user_id,
      read_date: now_date,
      last_read_chapter: last_chapter_read,
    });
    return true;
  }
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
  async updateReadManga(
    @Arg("options", () => ReadMangaInput) options: ReadMangaInput,
    @Arg("read_date", () => String, { nullable: true }) read_date: string,
    @Arg("last_chapter_read", () => Int, { nullable: true })
    last_read_chapter: number
  ) {
    const { user_id, manga_id } = options;
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
