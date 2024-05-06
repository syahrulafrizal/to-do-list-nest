import { UserStatus } from '@prisma/client';

export class UserEntity {
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatus;
  id: string;
}
