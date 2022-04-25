import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { ReadManga } from "./ReadManga";

@ObjectType()
@Entity()
export class Manga extends BaseEntity {
  @OneToMany(() => ReadManga, (rm) => rm.manga, { onDelete: "CASCADE" })
  UserConnection: ReadManga[];

  @Field()
  @Column()
  title: string;

  @Field()
  @PrimaryColumn({ primary: true })
  manga_id: string;
}
