import { Manga } from "../entity/Manga";

import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@InputType()
export class MangaInput {
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  manga_id: string;
}

@Resolver()
export default class MangaResolver {
  // SELECT * FROM Manga
  @Query(() => [Manga])
  async getManga(
    @Arg("manga_id", () => String, { nullable: true }) manga_id: string
  ) {
    if (manga_id) {
      const manga = await Manga.find({ where: { manga_id } });
      return manga;
    }
    const manga = await Manga.find();
    return manga;
  }

  // INSERT INTO MANGA
  @Mutation(() => Boolean)
  async createManga(
    @Arg("title", () => String) title: string,
    @Arg("manga_id", () => String) manga_id: string
  ) {
    const exists = await Manga.find({ where: { manga_id } });
    if (exists[0]) {
      // return `manga with id ${manga_id} already exists`;
      return true;
    }
    await Manga.create({
      manga_id: manga_id,
      title: title,
    }).save();
    return false;
  }

  // UPDATE Manga
  @Mutation(() => [Manga])
  async updateManga(@Arg("options", () => MangaInput) options: MangaInput) {
    const { manga_id } = options;
    const prev_manga = await Manga.find({ where: { manga_id } });
    await Manga.update({ manga_id }, options);
    const curr_manga = await Manga.find({ where: { manga_id } });
    return [prev_manga[0], curr_manga[0]];
  }
  //  REMOVE FROM Manga
  @Mutation(() => String)
  async removeManga(@Arg("manga_id", () => String) manga_id: string) {
    const manga = await Manga.find({ where: { manga_id } });
    await Manga.delete({ manga_id });
    return `removed manga ${manga[0].title}`;
  }
}
