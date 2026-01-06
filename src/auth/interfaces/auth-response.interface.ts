export interface AuthResponse {
  access_token: string;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
