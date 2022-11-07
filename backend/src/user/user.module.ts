import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Conversation]),
    forwardRef(() => AuthModule),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
