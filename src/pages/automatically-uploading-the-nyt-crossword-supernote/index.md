# Automatically uploading the daily NYT crossword to my Ratta Supernote

> Note: For anyone landing on this page from Google looking to automatically upload the NYT crossword to your Supernote or similar e-ink tablet, I'm afraid this solution is not for the everyperson and requires some knowledge of programming.

I (try) to do the New York Times crossword puzzle every day, and this holiday season when I purchased myself a [Ratta Supernote A6X](supernote.com), I was excited about the prospect of doing the crossword using an e-ink tablet rather than clumsily on my phone.

Unfortunately, e-ink tablet tech — although truly remarkable — is still very nascent, and I imagine a native NYT Crossword app is several years a way at minimum. Worse, the NYT has a pretty limited API, mostly related to articles and there are no endpoints related to puzzles or games.

For most, the standard solution is to manually download the crossword as a PDF every day, and then sync it to the Supernote using either Dropbox or their companion app. But I wanted to automate this.

First off, I noticed that the crossword PDF download URL is predictable for any given day:

```
https://nytimes.com/svc/crosswords/v2/puzzle/print/{month}{day}{2-digit year}.pdf
```

For today's date, that would look like:

```
https://nytimes.com/svc/crosswords/v2/puzzle/print/Dec2121.pdf
```

Unfortunately, these resources are only accessibe to NYT paid subscribers and any request to this URL by any unathenticated or unpaid user will result in an error.

My initial attempt used Selenium to automatically log in and attempt to download the file. Unfortunately, not only did I get flagged as a bot and blocked, I also could not for the life of me determine how to download a PDF file in headless Chrome.

So I changed tack, and realized that maybe I could make a web request directly to the download URL if I spoof my cookies. After all, I _am_ a paying subscriber. I determined that the cookies that are required to authenticate my account are: `nyt-a`, `NYT-S`, `nyt-auth-method`, and `nyt-m`. Fortunately, these won't expire for at least one year, meaning at worst I'd only need to manually update them every 356 puzzles. I can live with that.

So I made a test `wget` call:

```
wget --no-verbose --content-disposition "https://www.nytimes.com/svc/crosswords/v2/puzzle/print/Dec2121.pdf" \                                                     130 ↵
  --header='Referer: https://www.nytimes.com/crosswords/archive/daily' \
  --header='Cookie: nyt-a=[redacted]; NYT-S=[redacted]; nyt-auth-method=[redacted]; nyt-m=[redacted];'
```

And it worked!

```
2021-12-21 07:10:21 URL:https://www.nytimes.com/svc/crosswords/v2/puzzle/print/Dec2121.pdf [74658/74658] -> "Dec2121.pdf" [1]
```

So now I just needed turn this into a service.

I already pay for uptime on Heroku for this website, so I figured I'd use those resources and write in a worker that automatically fetches the crossword for me once per day. The backend of this website runs on Node.js, and so the following is what I ended up with:

```js
/**
 * This file schedules a cronjob which will automatically
 * download the NYT daily crossword 1 minute after its
 * published and then upload it to Dropbox.
 *
 * @author Nathan Buchar <hello@nathanbuchar.com>
 */

const cron = require('cron');
const dropbox = require('dropbox');
const https = require('https');
const path = require('path');

// Instantiates the Dropbox client so that later we can
// upload the downloaded crossword PDF files to Dropbox.
//
// Take note of the `DROPBOX_ACCESS_TOKEN` env variable. To
// generate one, please visit https://dropbox.tech/developers/generate-an-access-token-for-your-own-account.
const dbx = new dropbox.Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

// Gets the NYT crossword for a specific date.
function getNYTCrossword(date) {
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'America/New_York' }).format(date);
  const yy = new Intl.DateTimeFormat('en-US', { year: '2-digit', timeZone: 'America/New_York' }).format(date);
  const mon = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/New_York' }).format(date);
  const mm = new Intl.DateTimeFormat('en-US', { month: '2-digit', timeZone: 'America/New_York' }).format(date);
  const dd = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'America/New_York' }).format(date);
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(date);

  console.log('Attempting to download crossword...');

  // Make an authenticated request to where we believe the
  // crossword is stored. As of Jan 2022, the NYT crossword
  // is stored at this location with a filename in the
  // format of `MMMDDYY`. Ex. Jan0122.pdf.
  //
  // As part of the headers, we send our NYT cookie. This
  // needs to be copied from an authenticated NYT session.
  // This cookie requires at least the following: nyt-a,
  // NYT-S, nyt-auth-method, and nyt-m.
  const req = https.request({
    protocol: 'https:',
    host: 'www.nytimes.com',
    path: `/svc/crosswords/v2/puzzle/print/${mon}${dd}${yy}.pdf`,
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

        // The file has successfully downloaded, and now
        // we will upload it to Dropbox by concatenating
        // the data chunks into a buffer.
        //
        // Take note of the `SUPERNOTE_DOCUMENT_PATH` environment
        // variable. For Supernote devices, this will be
        // `/Supernote/Document`.
        //
        // As as it's coded below, crosswords will be uploaded to:
        // `/Supernote/Document/Crosswords` and the filename
        // will be in the format `YYYYMMDD_ddd-crossword.pdf`.
        dbx.filesUpload({
          path: path.join(process.env.SUPERNOTE_DOCUMENT_PATH, `Crosswords/${year}${mm}${dd}_${day}-crossword.pdf`),
          contents: Buffer.concat(data),
        }).then((response) => {
          console.log('Successfully uploaded crossword');
          console.log(`Content hash: ${response.result.content_hash}`);
        }).catch((err) => {
          console.log('Error writing to dropbox');
          console.log(err);
        });
      });
    } else {
      // The crossword is seemingly not yet available.
      // Try again in an hour.
      setTimeout(() => getNYTCrossword(date), 1000 * 60 * 60);
    }
  });

  req.on('error', (err) => {
    console.log(err);
  });

  req.end();
}

// Gets the NYT crossword for tomorrow's date, since it's
// released between 2 and 6 hours before midnight.
function getTomorrowsNYTCrossword() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  getNYTCrossword(tomorrow);
}

// This will create a scheduled task (cronjob) that will
// run at 10:01pm ET every weekday. On weekdays, the NYT
// crossword is released at 10pm.
const weekdayJob = new cron.CronJob({
  cronTime: '1 22 * * 1,2,3,4,5',
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsNYTCrossword();
  },
});

weekdayJob.start();

// This will create a scheduled task (cronjob) that will
// run at 6:01pm ET every weekend. On weekends, the NYT
// crossword is released at 6pm.
const weekendJob = new cron.CronJob({
  cronTime: '1 18 * * 0,6',
  timeZone: 'America/New_York',
  onTick() {
    getTomorrowsNYTCrossword();
  },
});

weekendJob.start();
```

If this helped you at all, I'd love to hear about it. If you share this code elsewhere, be sure to give me credit.
