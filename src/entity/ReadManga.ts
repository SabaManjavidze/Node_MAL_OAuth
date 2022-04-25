import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Manga } from "./Manga";
import { Users } from "./Users";

@ObjectType()
@Entity()
export class ReadManga extends BaseEntity {
  @Field()
  @PrimaryColumn({ onUpdate: "CASCADE" })
  manga_id: string;

  @Field()
  @PrimaryColumn({ onUpdate: "CASCADE" })
  user_id: number;

  @ManyToOne(() => Manga, (manga) => manga.UserConnection, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "manga_id" })
  manga: Manga;

  @ManyToOne(() => Users, (user) => user.MangaConnection, {
    // onDelete: "CASCADE",
    // onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: Users;

  @Field()
  @Column()
  read_date: string;
}
