const { CronJob } = require('cron');
const { Dropbox } = require('dropbox');
const path = require('path');
const fs = require('fs');
const wget = require('wget');

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

function getTomorrowsCrossword() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/New_York' }).format(tomorrow);
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'America/New_York' }).format(tomorrow);
  const year = new Intl.DateTimeFormat('en-US', { year: '2-digit', timeZone: 'America/New_York' }).format(tomorrow);

  const filename = `${month}${day}${year}.pdf`;
  const filePath = path.join(__dirname, filename);

  const req = wget.request({
    protocol: 'https',
    host: 'www.nytimes.com',
    path: `/svc/crosswords/v2/puzzle/print/${filename}`,
    method: 'GET',
    headers: {
      Referer: 'https://www.nytimes.com/crosswords/archive/daily',
      Cookie: process.env.NYT_COOKIE,
    },
  }, (res) => {
    if (res.statusCode === 200) {
      const stream = fs.createWriteStream(filePath);

      res.on('error', (err) => {
        console.log('Error, could not read crossword:');
        console.log(err);
      });

      res.on('data', (chunk) => {
        stream.write(chunk);
      });

      res.on('end', () => {
        console.log('Successfully downloaded crossword');
        stream.end();

        dbx.filesUpload({
          path: `/${filename}`,
          contents: fs.createReadStream(filePath),
        }).then((response) => {
          console.log('Successfully uploaded crossword:');
          console.log(response);
        });
      });
    }
  });

  req.end();
  req.on('error', (err) => {
    console.log('Error, could not wget:');
    console.log(err);
  });
}

const weekdayJob = new CronJob({
  cronTime: '1 22 * * 1,2,3,4,5', // 10:01pm ET every Weekday
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsCrossword();
  },
});

const weekendJob = new CronJob({
  cronTime: '1 18 * * 6,7', // 6:01pm ET every Weekend
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsCrossword();
  },
});

weekdayJob.start();
weekendJob.start();
