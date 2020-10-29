declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_URL: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      JWT_KEY: string;
    }
  }
}

export {};
