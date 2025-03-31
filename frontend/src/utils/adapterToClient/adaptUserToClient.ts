import {UserDTO} from '../../dto/user/user.dto';
import {User} from '../../types/types';

export const adaptUserToClient =
  (user: UserDTO): User => ({
    name: user.firstName,
    avatarUrl: user.avatarPath,
    type: user.type,
    email: user.email,
  });
