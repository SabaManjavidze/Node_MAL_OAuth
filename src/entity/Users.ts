import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Chapters } from "./Chapters";
// import { Chapters } from "./Chapters";

@Entity({ name: "users" })
@ObjectType()
export class Users extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  user_id: number;

  @ManyToMany(() => Chapters)
  chapters: Chapters[];

  @Field(() => String)
  @Column()
  user_name: string;

  @Field(() => String)
  @Column()
  picture: string;
}
