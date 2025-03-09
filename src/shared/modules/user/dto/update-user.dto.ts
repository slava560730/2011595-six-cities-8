import {TypeUser} from '../../../types/user.type.js';
import {IsEmail, IsEnum, IsOptional, IsString, Length} from 'class-validator';
import {USER_DTO_CONSTRAINTS} from '../user.constant.js';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  public avatarPath?: string;

  @IsOptional()
  @IsString()
  @Length(USER_DTO_CONSTRAINTS.USERNAME.MIN_LENGTH, USER_DTO_CONSTRAINTS.USERNAME.MAX_LENGTH)
  public firstname?: string;

@IsOptional()
@IsString()
@Length(USER_DTO_CONSTRAINTS.PASSWORD.MIN_LENGTH, USER_DTO_CONSTRAINTS.PASSWORD.MAX_LENGTH)
  public password?: string;

  @IsOptional()
  @IsEnum(TypeUser)
public type?: TypeUser;
}
