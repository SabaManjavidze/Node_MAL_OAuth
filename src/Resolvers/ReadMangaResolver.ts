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
    @Arg("read_date", { nullable: true }) read_date: string
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

  @Query(() => [ReadManga])
  async getReadManga() {
    return ReadManga.find();
  }
}
