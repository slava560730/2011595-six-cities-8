import {TypeUser} from '../../../types/user.type.js';
import {USER_DTO_CONSTRAINTS} from '../user.constant.js';
import {IsEmail, IsEnum, IsString, Length} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @Length(USER_DTO_CONSTRAINTS.USERNAME.MIN_LENGTH, USER_DTO_CONSTRAINTS.USERNAME.MAX_LENGTH)
  public firstname: string;

  @IsString()
  @Length(USER_DTO_CONSTRAINTS.PASSWORD.MIN_LENGTH, USER_DTO_CONSTRAINTS.PASSWORD.MAX_LENGTH)
  public password: string;

  @IsEnum(TypeUser)
  public type: TypeUser;
}
