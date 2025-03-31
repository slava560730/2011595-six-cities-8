import {UserType} from '../../const';

export class CreateUserDTO {
  public email!: string;

  public firstname!: string;

  public password!: string;

  public type!: UserType;
}
