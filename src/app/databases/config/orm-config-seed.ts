import { DataSource, DataSourceOptions } from 'typeorm';
import { configurations } from '../../configurations/index';

export const AppSeedDataSource = new DataSource({
  type: configurations.database.mysql.type,
  host: configurations.database.mysql.host,
  port: configurations.database.mysql.port,
  username: configurations.database.mysql.username,
  password: configurations.database.mysql.password,
  database: configurations.database.mysql.name,
  ssl: configurations.database.mysql.ssl === 'true' ? true : false,
  extra:
    configurations.database.mysql.ssl === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
  logging: configurations.database.mysql.logging === 'true' ? true : false,
  entities: [`${__dirname}/../../../models/**/*.{ts,js}`],
  migrations: [`${__dirname}/../seeds/**/*.{ts,js}`],
  migrationsRun: false,
} as DataSourceOptions);
