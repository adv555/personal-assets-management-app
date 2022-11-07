import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';
import TypeormConfig from './config/typeorm.config';
import { ExchangeModule } from './exchange/exchange.module';
import { WalletModule } from './wallet/wallet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { IncomeModule } from './income/income.module';
import { CostsModule } from './costs/costs.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InvoicesModule } from './invoices/invoices.module';
import { ToDoModule } from './todo/todo.module';
import { WalletLimitModule } from './walletLimit/walletLimit.module';
import { CryptoModule } from './crypto/cryptoItem/crypto.module';
import { CryptoPortfolioModule } from './crypto/cryptoPortfolio/cryptoPortfolio.module';

import { CryptoStatisticsModule } from './crypto/cryptoStatistics/cryptoStatistics.module';
import { ReportsModule } from './reports/reports.module';
import { WidgetsModule } from "./widgets/widgets.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => TypeormConfig(),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
      },
      options: {
        strict: true,
      },
    }),
    UserModule,
    AuthModule,
    WalletModule,
    ExchangeModule,
    IncomeModule,
    CostsModule,
    ConversationsModule,
    MessagesModule,
    WidgetsModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
    InvoicesModule,
    ToDoModule,
    WalletLimitModule,
    CryptoModule,
    CryptoPortfolioModule,
    CryptoStatisticsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
