import { DataSource, DataSourceOptions } from 'typeorm';
import { configurations } from '../../configurations/index';

export type TypeDatabase = 'mysql' | 'postgres';

export const AppDataSource = new DataSource({
  url: 'postgres://temgoua2013:7CnD6lxwcTvW@ep-rough-bar-357098.eu-central-1.aws.neon.tech/neondb',
  type: configurations.database.postgres.type,
  host: configurations.database.postgres.host,
  port: configurations.database.postgres.port,
  username: configurations.database.postgres.username,
  password: configurations.database.postgres.password,
  database: configurations.database.postgres.name,
  ssl: configurations.database.postgres.ssl === 'true' ? true : false,
  extra:
    configurations.database.postgres.ssl === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
  logging: configurations.database.postgres.logging === 'true' ? true : false,
  entities: [`${__dirname}/../../../models/**/*.{ts,js}`],
  migrations: [`${__dirname}/../migrations/**/*.{ts,js}`],
  migrationsRun: false,
  autoLoadEntities: true,
} as DataSourceOptions);
