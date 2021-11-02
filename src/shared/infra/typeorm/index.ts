import {
  createConnection as createConnectionBase,
  getConnectionOptions,
  // getConnectionManager,
} from 'typeorm';
import { Connection } from 'typeorm/connection/Connection';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
// import { ConnectionManager } from 'typeorm/connection/ConnectionManager';

type createConnectionPostgres = (
  options: PostgresConnectionOptions
) => Promise<Connection>;
const createConnection: createConnectionPostgres = createConnectionBase;

export default async (host = 'database'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  const newOptions = {
    ...defaultOptions,
    host: process.env.NODE_ENV !== 'test' ? host : 'localhost',
    database:
      process.env.NODE_ENV !== 'test' ? defaultOptions.database : 'rentx_test',
  } as PostgresConnectionOptions;

  return createConnection(newOptions);

  // const connectionManager = getConnectionManager();
  // const connection = connectionManager.create(newOptions);
  // await connection.connect();

  // return connectionManager;
};
