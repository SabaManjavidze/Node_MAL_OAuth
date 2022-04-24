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

@Resolver()
export default class ReadMangaResolver {
  // INSERT INTO READ_MANGA
  @Mutation(() => ReadManga)
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
    const read_manga = ReadManga.create({
      manga_id,
      user_id,
      read_date: now_date,
    }).save();
    return read_manga;
  }

  @Query(() => [ReadManga])
  async getReadManga() {
    return ReadManga.find();
  }
}
