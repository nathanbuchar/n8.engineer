/**
 * The file schedules a cronjob which will automatically
 * download the NYT daily crossword 1 minute after its
 * published and then upload it to Dropbox.
 *
 * @author Nathan Buchar <hello@nathanbuchar.com>
 */

const cron = require('cron');
const dropbox = require('dropbox');
const https = require('https');
const path = require('path');

// https://dropbox.tech/developers/generate-an-access-token-for-your-own-account
const dbx = new dropbox.Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

function getCrossword(date) {
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'America/New_York' }).format(date);
  const yy = new Intl.DateTimeFormat('en-US', { year: '2-digit', timeZone: 'America/New_York' }).format(date);
  const mon = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/New_York' }).format(date);
  const mm = new Intl.DateTimeFormat('en-US', { month: '2-digit', timeZone: 'America/New_York' }).format(date);
  const dd = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'America/New_York' }).format(date);
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(date);

  const req = https.request({
    protocol: 'https:',
    host: 'www.nytimes.com',
    path: `/svc/crosswords/v2/puzzle/print/${mon}${dd}${yy}.pdf`, // Ex. Dec1521.pdf
    method: 'GET',
    headers: {
      Referer: 'https://www.nytimes.com/crosswords/archive/daily',
      // Cookie requires nyt-a, NYT-S, nyt-auth-method, and nyt-m.
      Cookie: process.env.NYT_COOKIE,
    },
  }, (res) => {
    if (res.statusCode === 200) {
      const data = [];

      res.on('error', (err) => {
        console.log(err);
      });

      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.on('end', () => {
        console.log('Successfully downloaded crossword');

        // Upload the file to Dropbox.
        dbx.filesUpload({
          path: path.join(process.env.DROPBOX_UPLOAD_PATH, `${year}${mm}${dd}_${day}-crossword.pdf`),
          contents: Buffer.concat(data),
        }).then((response) => {
          console.log('Successfully uploaded crossword');
          console.log(`Content hash: ${response.result.content_hash}`);
        }).catch((err) => {
          console.log('Error writing to dropbox');
          console.log(err);
        });
      });
    }
  });

  req.on('error', (err) => {
    console.log(err);
  });

  req.end();
}

function getTomorrowsCrossword() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getCrossword(tomorrow);
}

const weekdayJob = new cron.CronJob({
  cronTime: '1 22 * * 1,2,3,4,5', // 10:01pm ET every weekday
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsCrossword();
  },
});

const weekendJob = new cron.CronJob({
  cronTime: '1 18 * * 0,6', // 6:01pm ET every weekend
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsCrossword();
  },
});

weekdayJob.start();
weekendJob.start();
