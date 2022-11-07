import { UserEntity } from 'src/user/entities/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAtStrategy } from './strategies/jwtAt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { JwtRtStrategy } from './strategies/jwtRt.strategy';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAtStrategy,
    JwtRtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity]),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
