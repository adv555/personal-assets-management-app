import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Request } from 'express';

type JwtPayload = {
  id: number;
  email: string;
  iat: number;
  exp: number;
};
@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRtStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  private static extractJwt(req: Request): string | null {
    if (req.cookies && 'tokenRefresh' in req.cookies) {
      return req.cookies.tokenRefresh;
    }
    return null;
  }

  async validate(req: Request, payload: JwtPayload) {
    return {
      ...payload,
    };
  }
}
