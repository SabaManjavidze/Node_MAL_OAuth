import { Ctx, Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Manga } from "./Manga";
import { ReadManga } from "./ReadManga";
import { MyContext } from "../types/MyContext";
import { UserManga } from "../types/UserManga";

@Entity()
@ObjectType()
export class Users extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  user_id: number;

  @Field(() => [UserManga], { nullable: true })
  async manga(@Ctx() { mangaLoader }: MyContext): Promise<UserManga[]> {
    return await mangaLoader.load(this.user_id);
  }

  @OneToMany(() => ReadManga, (rm) => rm.user)
  MangaConnection: ReadManga[];

  @Field()
  @Column()
  user_name: string;

  @Field()
  @Column()
  picture: string;
}
