import 'dotenv/config';

import path from 'path';

import client from './lib/client.js';
import engine from './lib/engine.js';

const config = {
  client,
  engine,
  sources: [
    {
      name: 'pages',
      contentType: 'page'
    },
    {
      name: 'blurbs',
      contentType: 'blurb'
    }
  ],
  targets: [
    {
      src: 'src/static',
      dest: 'dist'
    },
    {
      template: '404.njk',
      dest: 'dist/404.html',
      include: ['blurbs']
    },
    {
      template: 'debug.njk',
      dest: 'dist/debug/index.html',
      include: '*',
    },
    {
      template: 'guestbook.njk',
      dest: 'dist/guestbook/index.html',
      include: ['blurbs']
    },
    {
      template: 'posts.njk',
      dest: 'dist/posts/index.html',
      include: ['pages', 'blurbs']
    },
    (data) => {
      return data.pages.map((page) => {
        return [
          {
            template: 'page.njk',
            dest: path.join('dist', page.fields.url, 'index.html'),
            include: '*',
            extraContext: {
              ...page.fields
            }
          },
          
          // .md version for blog posts
          ...(page.fields.blogPost ? [
            {
              template: 'markdown.njk',
              dest: path.join('dist', `${page.fields.url}.md`),
              include: '*',
              extraContext: {
                ...page.fields,
              }
            }
          ] : [])
        ];
      });
    }
  ]
};

export default config;