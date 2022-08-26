import {
  ApolloClient,
  createHttpLink,
  FieldFunctionOptions,
  FieldMergeFunction,
  InMemoryCache,
} from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { NextApiRequest } from "next";

//!HACKY JSON parse solution
const listMerger: FieldMergeFunction<
  any,
  any,
  FieldFunctionOptions<Record<string, any>, Record<string, any>>
> = (existing = [], incoming) => {
  //since a Set only removes duplicates of primitives easily,
  //all entries are stringified and later parsed
  const combined = [...existing, ...incoming].map((e) => JSON.stringify(e));
  const set = new Set(combined);
  return Array.from(set).map((e) => JSON.parse(e));
};

export const apolloClient = new ApolloClient({
  uri: `/api/graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          locations: {
            keyArgs: ["where"],
            merge: listMerger,
          },
          courses: {
            keyArgs: ["where"],
            merge: listMerger,
          },
          messages: {
            keyArgs: false,
            merge: listMerger,
          },
          tutorials: {
            keyArgs: ["where"],
            merge: listMerger,
          },
          chapters: {
            keyArgs: ["where"],
            merge: listMerger,
          },
          timeslots: {
            keyArgs: ["where"],
            merge: listMerger,
          },
          users: {
            keyArgs: ["where"],
            merge: listMerger,
          },
        },
      },
    },
  }),
});

export const initApolloServerClient = (req: NextApiRequest) => {
  const origin = req.headers.origin;
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: origin + "/api/graphql",
      credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
  });

  return client;
};
