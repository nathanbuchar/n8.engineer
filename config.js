import path from 'path';

import client from '#lib/client.js';
import render from '#lib/render.js';
import runtime from '#lib/runtime.js';

import clean from '#lib/plugins/clean.js';
import contentful from '#lib/plugins/contentful.js';
import copy from '#lib/plugins/copy.js';
import watch from '#lib/plugins/watch.js';

import { hasFlag } from '#lib/utils/args.js';
import { src, dist } from '#lib/utils/paths.js';

const watchEnabled = hasFlag('--watch');
const cacheDisabled = hasFlag('--no-cache');

const config = {
  render,
  plugins: [
    clean(dist()),
    contentful({
      client,
      enableCache: runtime.isDevelopment && !cacheDisabled,
      sources: [
        {
          key: 'pages',
          contentType: 'page',
        },
        {
          key: 'blurbs',
          contentType: 'blurb',
        },
      ],
    }),
    copy({
      from: src('static'),
      to: dist(),
    }),
    watch({
      dir: src(),
      enabled: watchEnabled,
      async handler(ctx, builder) {
        await builder.build();
      },
    }),
  ],
  targets: [
    {
      template: '404.njk',
      dest: dist('404.html'),
      include: ['blurbs'],
    },
    {
      template: 'debug.njk',
      dest: dist('debug/index.html'),
      include: '*',
    },
    {
      template: 'rss.njk',
      dest: dist('rss.xml'),
      include: ['pages'],
    },
    {
      template: 'guestbook.njk',
      dest: dist('guestbook/index.html'),
      include: ['blurbs'],
    },
    {
      template: 'journal.njk',
      dest: dist('journal/index.html'),
      include: ['pages', 'blurbs'],
    },
    (data) => {
      return data.pages.map((page) => {
        return [
          {
            template: 'page.njk',
            dest: dist(`${page.fields.url}/index.html`),
            include: '*',
            extraContext: {
              ...page.fields,
              ...page.fields.blogPost && {
                markdownUrl: path.resolve(`/${page.fields.url}.md`),
              },
            },
          },

          // .md version for blog posts
          ...(page.fields.blogPost ? [
            {
              template: 'markdown.njk',
              dest: dist(`${page.fields.url}.md`),
              include: '*',
              extraContext: {
                ...page.fields,
              },
            },
          ] : []),
        ];
      });
    },
  ],
};

export default config;
