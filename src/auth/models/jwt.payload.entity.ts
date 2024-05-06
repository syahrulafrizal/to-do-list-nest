export class JwtPayloadEntity {
  id: string;
  user: {
    fullName: string;
    email: string;
    id: string;
    iat?: number;
    exp?: number;
  };
}
