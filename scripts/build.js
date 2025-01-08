import 'dotenv/config';

import fs from 'fs-extra';
import path from 'path';

import client from '../lib/contentful.js';
import nunjucks from '../lib/nunjucks.js';

async function clean() {
  return fs.remove('dist');
}

async function getEntries(contentType) {
  const data = await client.getEntries({
    content_type: contentType,
  });

  return data.items;
}

async function getData() {
  const [pages] = await Promise.all([
    getEntries('page'),
    // ...
  ]);

  return {
    pages,
  };
}

function buildPage(template, outputPath, data = {}) {
  return new Promise((resolve) => {
    nunjucks.render(template, { ...data }, (err, res) => {
      if (err) throw err;

      const str = res.trim();
      const outputPathNormed = path.normalize(outputPath);

      fs.outputFile(outputPathNormed, str, () => {
        console.log(`Wrote "${outputPathNormed}"`);
        resolve();
      });
    });
  });
}

async function buildPages() {
  const data = await getData();

  const pages = data.pages.filter((page) => !page.fields.blogPost);

  const blogPosts = data.pages.filter((page) => page.fields.blogPost).sort((a, b) => {
    return new Date(a.fields.date) < new Date(b.fields.date) ? -1 : 1;
  });


  return Promise.all([
    buildPage('404.njk', 'dist/404.html'),
    buildPage('rss.njk', 'dist/rss.xml', data),
    buildPage('posts.njk', 'dist/posts/index.html', data),
    buildPage('guestbook.njk', 'dist/guestbook/index.html'),

    // Standalone pages.
    ...pages.map((page) => (
      buildPage('page.njk', `dist/${page.fields.url}/index.html`, {
        ...data,
        ...page.fields,
      })
    )),

    // Blog posts.
    ...blogPosts.map((page, i) => (
      buildPage('page.njk', `dist/${page.fields.url}/index.html`, {
        ...data,
        ...page.fields,
        prevPost: blogPosts[i - 1],
        nextPost: blogPosts[i + 1],
      })
    )),
  ]);
}

async function copyStatic() {
  return fs.copy('src/static', 'dist');
}

async function build() {
  await clean();
  await buildPages();
  await copyStatic();
}

build();
