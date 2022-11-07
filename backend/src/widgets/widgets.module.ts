import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthMiddleware } from '../auth/middleware/auth.middleware';
import { UserModule } from '../user/user.module';
import { WidgetEntity } from './entities/widget.entity';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WidgetEntity]), UserModule],
  providers: [WidgetsService],
  controllers: [WidgetsController],
})
export class WidgetsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WidgetsController);
  }
}
