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

function getNYTCrossword(date) {
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'America/New_York' }).format(date);
  const yy = new Intl.DateTimeFormat('en-US', { year: '2-digit', timeZone: 'America/New_York' }).format(date);
  const mon = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/New_York' }).format(date);
  const mm = new Intl.DateTimeFormat('en-US', { month: '2-digit', timeZone: 'America/New_York' }).format(date);
  const dd = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'America/New_York' }).format(date);
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(date);

  console.log(`Attempting to get NYT crossword for ${year}-${mm}-${dd}`);

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
    if (res.statusCode !== 200) {
      // The crossword is seemingly not yet available.
      // Try again in an hour.
      console.log('NYT crossword not yet available. Trying again in 1 hour...');
      setTimeout(() => getNYTCrossword(date), 1000 * 60 * 60);
      return;
    }

    const data = [];

    res.on('error', (err) => {
      console.log(err);
    });

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Successfully downloaded NYT crossword');

      // Upload the file to Dropbox.
      dbx.filesUpload({
        path: path.join(process.env.DROPBOX_UPLOAD_PATH, `${year}${mm}${dd}_NYT_${day}-crossword.pdf`),
        contents: Buffer.concat(data),
      }).then((response) => {
        console.log('Successfully uploaded NYT crossword');
        console.log(`Content hash: ${response.result.content_hash}`);
      }).catch((err) => {
        console.log('Error writing to dropbox');
        console.log(err);
      });
    });
  });

  req.on('error', (err) => {
    console.log(err);
  });

  req.end();
}

function getWSJCrossword(date) {
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'America/New_York' }).format(date);
  const mm = new Intl.DateTimeFormat('en-US', { month: '2-digit', timeZone: 'America/New_York' }).format(date);
  const dd = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'America/New_York' }).format(date);
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(date);

  console.log(`Attempting to get WSJ crossword for ${year}-${mm}-${dd}`);

  const req = https.request({
    protocol: 'https:',
    host: 's.wsj.net',
    path: `/public/resources/documents/XWD${mm}${dd}${year}.pdf`, // Ex. XWD12152021.pdf
    method: 'GET',
  }, (res) => {
    if (res.statusCode !== 200) {
      // The crossword is seemingly not yet available.
      // Try again in an hour.
      console.log('WSJ crossword not yet available. Trying again in 1 hour...');
      setTimeout(() => getWSJCrossword(date), 1000 * 60 * 60);
      return;
    }

    const data = [];

    res.on('error', (err) => {
      console.log(err);
    });

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Successfully downloaded WSJ crossword');

      // Upload the file to Dropbox.
      dbx.filesUpload({
        path: path.join(process.env.DROPBOX_UPLOAD_PATH, `${year}${mm}${dd}_WSJ_${day}-crossword.pdf`),
        contents: Buffer.concat(data),
      }).then((response) => {
        console.log('Successfully uploaded WSJ crossword');
        console.log(`Content hash: ${response.result.content_hash}`);
      }).catch((err) => {
        console.log('Error writing to dropbox');
        console.log(err);
      });
    });
  });

  req.on('error', (err) => {
    console.log(err);
  });

  req.end();
}

function getTomorrowsNYTCrossword() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getNYTCrossword(tomorrow);
}

function getTomorrowsWSJCrossword() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getWSJCrossword(tomorrow);
}

const jobNYTWeekdays = new cron.CronJob({
  cronTime: '1 22 * * 1,2,3,4,5', // 10:01pm ET every weekday
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsNYTCrossword();
  },
});

const jobNYTWeekends = new cron.CronJob({
  cronTime: '1 18 * * 0,6', // 6:01pm ET every weekend
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsNYTCrossword();
  },
});

const jobWSJCrosswordTueThruSat = new cron.CronJob({
  cronTime: '2 13 * * 1,2,3,4,5', // 1:02pm ET every Mon thru Fri
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsWSJCrossword();
  },
});

const jobWSJCrosswordMon = new cron.CronJob({
  cronTime: '2 21 * * 0', // 9:02pm ET every Sunday
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsWSJCrossword();
  },
});

jobNYTWeekdays.start();
jobNYTWeekends.start();
jobWSJCrosswordTueThruSat.start();
jobWSJCrosswordMon.start();
