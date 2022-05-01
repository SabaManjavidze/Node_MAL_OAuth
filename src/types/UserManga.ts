import { Field, ObjectType } from "type-graphql";
import { Manga } from "../entity/Manga";

@ObjectType()
export class UserManga {
  @Field()
  manga_details: Manga;

  @Field()
  read_date: String;
  @Field()
  last_read_chapter: String;
}
