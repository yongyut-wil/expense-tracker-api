export interface JwtPayload {
  sub: number;
  email: string;
}

export interface RequestUser {
  userId: number;
  email: string;
}
