import {LoginUserDto,} from '../user/index.js';
import {UserEntity} from '../entities/index.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
