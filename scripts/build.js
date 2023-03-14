import 'dotenv/config';

import fs from 'fs-extra';
import path from 'path';

import client from '../lib/contentful.js';
import nunjucks from '../lib/nunjucks.js';

let pages;

function clean() {
  return fs.remove('dist');
}

function copyStatic() {
  return fs.copy('src/static', 'dist');
}

async function fetchData() {
  const data = await client.getEntries({
    content_type: 'page',
  });

  pages = data.items;
}

function buildPage(template, filePath, data = {}) {
  return new Promise((resolve) => {
    nunjucks.render(template, { ...data, pages }, (err, res) => {
      const str = res.trim();
      const normFilePath = path.normalize(filePath);

      fs.outputFile(normFilePath, str, () => {
        resolve();
      });
    });
  });
}

function buildPages() {
  return Promise.all([
    buildPage('404.njk', 'dist/404.html'),
    buildPage('rss.njk', 'dist/rss.xml'),
    buildPage('blog.njk', 'dist/blog/index.html'),
    buildPage('guestbook.njk', 'dist/guestbook/index.html'),

    // Contentful pages.
    ...pages.map(({ fields }) => (
      buildPage('page.njk', `dist/${fields.url}/index.html`, fields)
    )),
  ]);
}

async function build() {
  await clean();
  await fetchData();
  await buildPages();
  await copyStatic();
}

build();
