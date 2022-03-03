import createConnection from '@shared/infra/typeorm';

import { app } from './app';

(async () => {
  await createConnection();

  app.listen(3333, () => console.log('🚀 Server is running!'));
})().catch((err) => console.log(err));
