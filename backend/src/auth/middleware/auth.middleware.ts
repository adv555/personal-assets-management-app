import { UserEntity } from '../../user/entities/user.entity';
import { IRequestWithUser } from '../../interfaces/requestWithUser.interface';
import { verify } from 'jsonwebtoken';
import { NextFunction } from 'express';
import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: IRequestWithUser, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodeUser = verify(token, process.env.JWT_SECRET) as UserEntity;
      req.user = decodeUser;
      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
