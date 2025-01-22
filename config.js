import 'dotenv/config';

import client from './lib/client.js';
import engine from './lib/engine.js';

import clean from './lib/plugins/clean.js';
import contentful from './lib/plugins/contentful.js';
import copy from './lib/plugins/copy.js';

const config = {
  engine,
  plugins: [
    clean('dist'),
    contentful({
      client,
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
      from: 'src/static',
      to: 'dist',
    }),
  ],
  targets: [
    {
      template: '404.njk',
      dest: 'dist/404.html',
      include: ['blurbs'],
    },
    {
      template: 'debug.njk',
      dest: 'dist/debug/index.html',
      include: '*',
    },
    {
      template: 'rss.njk',
      dest: 'dist/rss.xml',
      include: ['pages'],
    },
    {
      template: 'guestbook.njk',
      dest: 'dist/guestbook/index.html',
      include: ['blurbs'],
    },
    {
      template: 'posts.njk',
      dest: 'dist/posts/index.html',
      include: ['pages', 'blurbs'],
    },
    (data) => {
      return data.pages.map((page) => {
        return [
          {
            template: 'page.njk',
            dest: `dist/${page.fields.url}/index.html`,
            include: '*',
            extraContext: {
              ...page.fields,
            },
          },
          
          // .md version for blog posts
          ...(page.fields.blogPost ? [
            {
              template: 'markdown.njk',
              dest: `dist/${page.fields.url}.md`,
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