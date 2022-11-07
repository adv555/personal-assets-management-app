export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserGoogle = {
  email: string;
  firstName: string;
  lastName: string;
  avatarPath: string;
  id: number;
  accessToken: string;
};

export type JwtPayload = {
  id: number;
  email: string;
};
