import {
  createConnection as createConnectionBase,
  getConnectionOptions,
} from 'typeorm';
import { Connection } from 'typeorm/connection/Connection';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

type createConnectionPostgres = (
  options: PostgresConnectionOptions
) => Promise<Connection>;
const createConnection: createConnectionPostgres = createConnectionBase;

export default async (
  host = process.env.PSQL_HOST || 'localhost'
): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  const newOptions = {
    ...defaultOptions,
    port: process.env.PSQL_PORT,
    password: process.env.PSQL_PASSWORD,
    host: process.env.NODE_ENV !== 'test' ? host : 'localhost',
    database:
      process.env.NODE_ENV !== 'test' ? defaultOptions.database : 'rentx_test',
  } as PostgresConnectionOptions;

  console.log(newOptions);

  return createConnection(newOptions);
};
