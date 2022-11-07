import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () =>
  ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    autoLoadEntities: true, // models will be loaded automatically
    synchronize: true, // // your entities will be synced with the database(recommended: disable in prod)
    entities: [join(__dirname, '../', '**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../', 'database/migrations/**/*{.ts,.js}')],
  } as TypeOrmModuleOptions);
