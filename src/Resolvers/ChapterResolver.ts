import { Chapters } from "../entity/Chapters";

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
class chapterInput {
  @Field({ nullable: true })
  chap_title: string;
  @Field({ nullable: true })
  picture: string;
}

@Resolver()
export default class ChapterResolver {
  // SELECT * FROM CHAPTERS
  @Query(() => [Chapters])
  async getChapters() {
    return await Chapters.find();
  }

  // INSERT INTO CHAPTERS
  @Mutation(() => Chapters)
  async createChapter(
    @Arg("id", () => String) id: string,
    @Arg("chap_title", () => String) chap_title: string,
    @Arg("chap_num", () => Int) chap_num: number,
    @Arg("manga_id", () => String) manga_id: string,
    @Arg("upload_date", () => String) upload_date: string,
    @Arg("view_count", () => String) view_count: string
  ) {
    const chapter = await Chapters.create({
      chap_num: chap_num,
      chap_title: chap_title,
      manga_id: manga_id,
      upload_date: upload_date,
      view_count: view_count,
      id: id,
    }).save();
    return chapter;
  }

  // UPDATE CHAPTERS
  @Mutation(() => [Chapters])
  async updateChapter(
    @Arg("id", () => String) id: string,
    @Arg("options", () => chapterInput) options: chapterInput
  ) {
    const prev_chapter = await Chapters.find({ where: { id } });
    await Chapters.update({ id }, options);
    const curr_chapter = await Chapters.find({ where: { id } });
    return [prev_chapter[0], curr_chapter[0]];
  }
  //  REMOVE FROM CHAPTERS
  @Mutation(() => String)
  async removeChapter(@Arg("id", () => String) id: string) {
    const chapter = await Chapters.find({ where: { id } });
    await Chapters.delete({ id });
    return `removed chapter ${chapter[0].chap_title}`;
  }
}
