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
  async getManga() {
    return await Manga.find();
  }

  // INSERT INTO MANGA
  @Mutation(() => Manga)
  async createManga(
    @Arg("title", () => String) title: string,
    @Arg("manga_id", () => String) manga_id: string
  ) {
    const manga = await Manga.create({
      manga_id: manga_id,
      title: title,
    }).save();
    return manga;
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
