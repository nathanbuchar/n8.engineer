const cron = require('cron');
const dropbox = require('dropbox');
const https = require('https');
const moment = require('moment');
const path = require('path');

// Instantiate the Dropbox instance.
const dbx = new dropbox.Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

function getNYTCrossword(date, attempts = 1) {
  const d = moment(date);

  console.log('Attempting to download NYT crossword...');

  // Get the crossword.
  const req = https.request({
    protocol: 'https:',
    host: 'www.nytimes.com',
    path: `/svc/crosswords/v2/puzzle/print/${d.format('MMMDDYY')}.pdf`,
    method: 'GET',
    headers: {
      Referer: 'https://www.nytimes.com/crosswords/archive/daily',
      Cookie: process.env.NYT_COOKIE,
    },
  }, (res) => {

    if (res.statusCode !== 200 && attempts < (12 * 24)) {
      // The crossword is seemingly not yet available.
      // Try again in 5 mins.
      console.log('NYT crossword not yet available. Trying again in 5 mins...');
      setTimeout(() => getNYTCrossword(date, attempts + 1), 1000 * 60 * 5);
      return;
    }

    const data = [];

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Successfully downloaded NYT crossword');

      // The file has successfully downloaded. Upload it to
      // Dropbox.
      dbx.filesUpload({
        path: path.join(process.env.SUPERNOTE_DOCUMENT_PATH, `Crosswords/${d.format('YYMMDD_ddd')}_NYT_crossword.pdf`),
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

  req.end();
}

function getTomorrowsNYTCrossword() {
  const today = new Date();
  const todayNYTime = today.toLocaleString('en-US', { timeZone: 'America/New_York' });

  const tomorrow = new Date(todayNYTime);
  tomorrow.setDate(tomorrow.getDate() + 0);

  getNYTCrossword(tomorrow);
}

const weekdayJob = new cron.CronJob({
  cronTime: '1 22 * * 1,2,3,4,5', // Mon-Fri @ 6:01pm ET.
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsNYTCrossword();
  },
});

const weekendJob = new cron.CronJob({
  cronTime: '1 18 * * 0,6', // Sun,Sat @ 6:01pm ET.
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsNYTCrossword();
  },
});

weekdayJob.start();
weekendJob.start();
