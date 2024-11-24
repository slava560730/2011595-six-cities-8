export type TypeUser = 'ordinary' | 'pro';

export type User = {
  firstname: string;
  email: string;
  avatarPath: string;
  password: string;
  type:TypeUser;

}
