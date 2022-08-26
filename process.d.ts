declare namespace NodeJS {
  export interface ProcessEnv {
    ACACIA_JWT_SECRET: string;
    ACACIA_AWS_REGION: string;
    ACACIA_AWS_KEY_ID: string;
    ACACIA_AWS_SECRET_KEY: string;
    ACACIA_AWS_S3_BUCKET: string;
    ACACIA_NEO4J_URI: string;
    ACACIA_NEO4J_USERNAME: string;
    ACACIA_NEO4J_PASSWORD: string;
  }
}
