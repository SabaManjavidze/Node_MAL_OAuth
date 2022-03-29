import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { Users } from "./Users";

@ObjectType()
@Entity()
export class Chapters extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: string;

  @ManyToMany(() => Users)
  @JoinTable({
    name: "ReadChapters",
    joinColumn: {
      name: "chapter_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "user_id",
    },
  })
  @Field()
  @Column()
  chap_title: string;

  @Field(() => Int)
  @Column()
  chap_num: number;

  @Field()
  @Column()
  upload_date: string;

  @Field()
  @Column()
  manga_id: string;

  @Field()
  @Column()
  view_count: string;
}
