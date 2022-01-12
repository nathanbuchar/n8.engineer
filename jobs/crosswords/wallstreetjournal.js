const cron = require('cron');
const dropbox = require('dropbox');
const https = require('https');
const moment = require('moment');
const path = require('path');

// Instantiate the Dropbox instance.
const dbx = new dropbox.Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

function getWSJCrossword(date, attempts = 1) {
  const d = moment(date);

  console.log('Attempting to download WSJ crossword...');

  // Get the crossword.
  const req = https.request({
    protocol: 'https:',
    host: 's.wsj.net',
    path: `/public/resources/documents/${d.format('[XWD]MMDDYYYY')}.pdf`, // Ex. XWD12152021.pdf
    method: 'GET',
  }, (res) => {

    if (res.statusCode !== 200 && attempts < (12 * 24)) {
      // The crossword is seemingly not yet available.
      // Try again in 5 mins.
      console.log('WSJ crossword not yet available. Trying again in 5 mins...');
      setTimeout(() => getWSJCrossword(date, attempts + 1), 1000 * 60 * 5);
      return;
    }

    const data = [];

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Successfully downloaded WSJ crossword');

      // The file has successfully downloaded. Upload it to
      // Dropbox.
      dbx.filesUpload({
        path: path.join(process.env.SUPERNOTE_DOCUMENT_PATH, `Crosswords/${d.format('YYMMDD_ddd')}_WSJ_crossword.pdf`),
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

function getTomorrowsWSJCrossword() {
  const today = new Date();
  const todayNYTime = today.toLocaleString('en-US', { timeZone: 'America/New_York' });

  const tomorrow = new Date(todayNYTime);
  tomorrow.setDate(tomorrow.getDate() + 1);

  getWSJCrossword(tomorrow);
}

const jobWSJWeekdays = new cron.CronJob({
  cronTime: '2 13 * * 1,2,3,4,5', // M-F @ 1:02pm ET.
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsWSJCrossword();
  },
});

const jobWSJWeekends = new cron.CronJob({
  cronTime: '2 21 * * 0', // Sun @ 9:02pm ET.
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsWSJCrossword();
  },
});

jobWSJWeekdays.start();
jobWSJWeekends.start();
