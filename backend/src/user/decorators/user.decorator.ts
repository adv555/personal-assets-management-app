import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestWithUser } from '../../interfaces/requestWithUser.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<IRequestWithUser>();
  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }
  return request.user;
});
