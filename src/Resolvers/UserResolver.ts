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

@InputType()
class UserInput {
  @Field({ nullable: true })
  user_name: string;
  @Field({ nullable: true })
  picture: string;
}

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
    const user = await Users.create({
      user_id,
      user_name,
      picture,
    }).save();
    return user;
  }

  // UPDATE USER
  @Mutation(() => [Users])
  async updateUser(
    @Arg("user_id", () => Int) user_id: number,
    @Arg("options", () => UserInput) options: UserInput
  ) {
    const prev_user = await Users.find({ where: { user_id } });
    await Users.update({ user_id }, options);
    const curr_user = await Users.find({ where: { user_id } });
    return [prev_user[0], curr_user[0]];
  }
  //  REMOVE FROM USERS
  @Mutation(() => String)
  async removeUser(@Arg("user_id", () => Int) user_id: number) {
    const name = await Users.find({ where: { user_id } });
    await Users.delete({ user_id });
    return `removed user ${name[0].user_name}`;
  }
}
