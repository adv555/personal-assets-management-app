import { Request } from 'express';
import { UserEntity } from '../user/entities/user.entity';

export interface IRequestWithUser extends Request {
  user?: UserEntity;
}
