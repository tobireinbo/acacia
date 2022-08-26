import { randomBytes, pbkdf2Sync } from "crypto";
import { CreateUserDto } from "./dto/create-user.dto";
import { CREATE_USER } from "./queries/create-user.query";
import { FIND_USERS } from "./queries/find-users.query";
import { NextApiRequest } from "next";
import { initApolloServerClient } from "src/shared/clients/apollo.client";
async function createOne(
  req: NextApiRequest,
  dto: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }
) {
  const { password, firstname, lastname, email } = dto;

  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  const user: CreateUserDto = {
    firstname,
    lastname,
    email,
    salt,
    hashedPassword: hash,
  };

  try {
    const client = initApolloServerClient(req);
    const createdUser = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        input: [user],
      },
    });

    if (!createdUser.data?.createUsers?.users[0]) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  return user;
}

async function findOneByLogin(
  req: NextApiRequest,
  dto: { email: string; password: string }
) {
  try {
    const client = initApolloServerClient(req);
    const getUser = await client.query({
      query: FIND_USERS,
      variables: {
        where: {
          email: dto.email,
        },
      },
    });
    const user = getUser.data.users[0];
    if (!user) {
      return;
    }
    const hash = pbkdf2Sync(
      dto.password,
      user.salt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    if (hash !== user.hashedPassword) {
      return;
    }

    return user;
  } catch {}
}

export const usersService = { createOne, findOneByLogin };
