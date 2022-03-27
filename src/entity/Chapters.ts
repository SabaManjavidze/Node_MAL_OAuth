import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  // JoinTable,
  // ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { Users } from "./Users";
// import { User } from "./User";
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

  @Field()
  @Column()
  chap_num: number;

  @Column()
  upload_date: string;

  @Column()
  manga_id: string;

  @Column()
  view_count: string;
}
