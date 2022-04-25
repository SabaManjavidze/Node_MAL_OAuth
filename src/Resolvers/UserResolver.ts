import { Users } from "../entity/Users";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Manga } from "../entity/Manga";
import { MangaInput } from "./MangaResolver";

@InputType()
class UserInput {
  @Field()
  user_id: number;
  @Field({ nullable: true })
  user_name: string;
  @Field({ nullable: true })
  picture: string;
}

// @InputType()
// class MangaUpdateInput {
//   @Field(() => [String!]!)
//   chapter_id: string[];
// }

@Resolver()
export default class UserResolver {
  // SELECT * FROM USERS
  @Query(() => [Users])
  async getUsers() {
    const users = await Users.find();
    return users;
  }

  // INSERT INTO USERS
  @Mutation(() => Users)
  async createUser(
    @Arg("user_id", () => Int) user_id: number,
    @Arg("user_name") user_name: string,
    @Arg("picture") picture: string
  ) {
    const user = Users.create({
      user_id,
      user_name,
      picture,
    }).save();
    return user;
  }

  // UPDATE USER
  @Mutation(() => [Users])
  async updateUser(@Arg("options", () => UserInput) options: UserInput) {
    const { user_id } = options;
    const prev_user = await Users.find({ where: { user_id } });

    await Users.update({ user_id }, { ...options });
    const curr_user = await Users.find({ where: { user_id } });
    return [prev_user[0], curr_user[0]];
  }

  //  REMOVE FROM USERS
  @Mutation(() => String)
  async removeUser(@Arg("user_id", () => Int) user_id: number) {
    const user = await Users.find({ where: { user_id } });
    await user[0].remove();
    return `removed user ${user[0].user_name}`;
  }
}
