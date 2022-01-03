const axios = require('axios');
const createDOMPurify = require('dompurify');
const cron = require('cron');
const dropbox = require('dropbox');
const https = require('https');
const slugify = require('slugify');
const path = require('path');
const { URL } = require('url');
const { Readability, isProbablyReaderable } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const { mdToPdf } = require('md-to-pdf');

// https://dropbox.tech/developers/generate-an-access-token-for-your-own-account
const dbx = new dropbox.Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

function generatePDFFromStory(storyId) {
  axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`).then(({ data }) => {
    const { protocol, host, pathname } = new URL(data.url);

    if (protocol !== 'https:') return;

    // Get the article.
    const req = https.request({
      protocol,
      host,
      path: pathname,
      method: 'GET',
    }, (res) => {
      if (res.statusCode === 200) {
        let chunks = '';

        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('end', () => {
          const win = new JSDOM('').window;
          const dom = new JSDOM(chunks);
          const doc = dom.window.document;

          // Determine if article is probably readerable before
          // continuing.
          if (isProbablyReaderable(doc)) {
            const domPurifier = createDOMPurify(win);
            const article = new Readability(doc);
            const { title, content, byline, siteName } = article.parse();

            // Generate markdown
            let mdContent = '';

            if (siteName) {
              mdContent += `[${siteName} (${host})](${host})\n\n`;
            } else {
              mdContent += `[${host}](${host})\n\n`;
            }

            mdContent += `# ${domPurifier.sanitize(title)}\n\n`;

            if (byline) {
              mdContent += `${domPurifier.sanitize(byline)}\n\n`;
            }

            mdContent += '<br/><hr/><br/>\n\n';
            mdContent += domPurifier.sanitize(content);

            // Convert markdown to PDF
            mdToPdf({
              content: mdContent,
            }, {
              pdf_options: {
                format: 'A5',
                margin: {
                  top: '20mm', // +10mm to account for toolbar
                  right: '10mm',
                  bottom: '10mm',
                  left: '10mm',
                },
              },
            }).then((pdf) => {
              if (pdf) {
                const slug = slugify(data.title, { remove: /[*+~.()'"!:@/]/g });

                // Upload generated PDF to Dropbox.
                dbx.filesUpload({
                  path: path.join(process.env.SUPERNOTE_DOCUMENT_PATH, `/Hacker News/${Date.now()}-${slug}.pdf`),
                  contents: pdf.content,
                }).then((response) => {
                  console.log(`Successfully uploaded ${data.title}`);
                  console.log(`Content hash: ${response.result.content_hash}`);
                }).catch((err) => {
                  console.log('Error writing to dropbox');
                  console.log(err);
                });
              }
            });
          }
        });
      }
    });

    req.end();
  });
}

function generatePDFsFromTopTenStories() {
  axios.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(({ data }) => {
    const topStories = data.slice(0, 15);

    topStories.forEach((storyId, i) => {
      setTimeout(() => {
        generatePDFFromStory(storyId);
      }, i * 2500);
    });
  });
}

const getStories = new cron.CronJob({
  cronTime: '0 6 * * *', // Every day at 6am PT
  timeZone: 'America/Los_Angeles',
  onTick() {
    generatePDFsFromTopTenStories();
  },
});

getStories.start();
