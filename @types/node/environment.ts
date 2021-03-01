import { AdminUser } from '../../src/entity/admin-user';
import { User } from '../../src/entity/user';

interface UserPayload {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
}

interface AdminPayload {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
}

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
  namespace Express {
    interface Request {
      currentUser: UserPayload;
      user: User;
      userAndNon: User | null;
      currentAdmin: AdminPayload;
      adminUser: AdminUser;
    }
  }
}

export {};
