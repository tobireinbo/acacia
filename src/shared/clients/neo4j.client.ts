import neo4j from "neo4j-driver";

export const neo4jDriver = neo4j.driver(
  process.env.ACACIA_NEO4J_URI,
  neo4j.auth.basic(
    process.env.ACACIA_NEO4J_USERNAME,
    process.env.ACACIA_NEO4J_PASSWORD
  ),
  {
    disableLosslessIntegers: true,
  }
);
