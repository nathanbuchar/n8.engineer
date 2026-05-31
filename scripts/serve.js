import 'dotenv/config';

import express from 'express';

import { dist } from '#lib/utils/paths.js';
import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('server');

const serve = (port = 3000) => {
  const app = express();

  // Express middleware.
  app.use(express.static(dist(), {
    dotfiles: 'allow',
  }));

  // Start the Express server.
  app.listen(port, () => {
    debug('Listening on port %d...', port);
  });

  return app;
};

serve();
