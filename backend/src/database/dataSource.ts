import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import TypeormConfig from '../config/typeorm.config';

dotenv.config({
  path: join(__dirname, '../../../.env.dev'),
  override: false,
});
export default new DataSource(<DataSourceOptions>TypeormConfig());
