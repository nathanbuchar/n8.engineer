import 'dotenv/config';

import path from 'path';

import Builder from '#lib/builder.js';

const build = async () => {
  const pathToConfig = path.resolve('config.js');

  // Import build config.
  const { default: config } = await import(pathToConfig);

  // Instantiate the builder.
  const builder = new Builder(config);

  // Build the project.
  await builder.build();

  return builder;
};

build();
