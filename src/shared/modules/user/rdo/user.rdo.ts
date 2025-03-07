import {Expose} from 'class-transformer';
import {TypeUser} from '../../../types/user.type.js';

export class UserRdo {
  @Expose()
  public email: string ;

  @Expose()
  public avatarPath: string;

  @Expose()
  public firstname: string;

  @Expose()
  public type!: TypeUser;

  @Expose()
  public favorites!: string[];
}
