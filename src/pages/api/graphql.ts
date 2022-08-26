import { Neo4jGraphQL } from "@neo4j/graphql";
import {
  ApolloServer,
  AuthenticationError,
  ValidationError,
} from "apollo-server-micro";
import { neo4jDriver } from "src/shared/clients/neo4j.client";
import typeDefs from "src/graphql/typeDefs";
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { authService } from "src/modules/auth/auth.service";

const neoSchema = new Neo4jGraphQL({ typeDefs, driver: neo4jDriver });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  const schema = await neoSchema.getSchema();
  const server = new ApolloServer({
    schema: schema,
    context: ({ req, res }) => {
      const stringifiedCookies = req.headers.cookie;
      if (!stringifiedCookies) {
        throw new ValidationError("failed to get cookies");
      }
      const cookies = parse(stringifiedCookies);
      const token = cookies.token;

      if (!token) {
        throw new AuthenticationError("token required");
      }

      const user = authService.getUserByToken(token);

      if (!user) {
        throw new AuthenticationError("couldn't parse token");
      }
    },
  });
  await server.start();
  await server.createHandler({ path: "/api/graphql" })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
