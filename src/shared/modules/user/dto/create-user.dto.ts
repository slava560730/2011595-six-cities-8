import {TypeUser} from '../../../types/user.type.js';

export class CreateUserDto {
  public email: string;
  public avatarPath: string;
  public firstname: string;
  public type: TypeUser;
  public password: string;
}
