export enum TypeUser {
  Pro = 'pro',
  Standard = 'ordinary',
}

export type User = {
  firstname: string;
  email: string;
  avatarPath: string;
  type: TypeUser;
}
