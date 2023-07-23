import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../../config/index';

export const AppSeedDataSource = new DataSource({
  // url: configurations.database.url,
  type: config.database.postgres.type,
  host: config.database.postgres.host,
  port: config.database.postgres.port,
  username: config.database.postgres.username,
  password: config.database.postgres.password,
  database: config.database.postgres.name,
  ssl: config.database.postgres.ssl === 'true' ? true : false,
  extra:
  config.database.postgres.ssl === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
  logging: config.database.postgres.logging === 'true' ? true : false,
  entities: [`${__dirname}/../../../models/**/*.{ts,js}`],
  migrations: [`${__dirname}/../seeds/**/*.{ts,js}`],
  migrationsRun: false,
} as DataSourceOptions);
