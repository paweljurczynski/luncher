const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const serviceId = process.env.SERVICE_ID;
const moment = require("moment-timezone");
const axios = require('axios/index');
const { CronJob } = require('cron');
const {toSlackPost} = require("./utils/functions");

require("moment/locale/pl");

const timezone = 'Europe/Warsaw';

moment.tz.setDefault(timezone);

const cache = {};

async function writeCache() {
    const restaurants = [
        require('./restaurants/emalia'),
        require('./restaurants/ogrod'),
        require('./restaurants/szuwary')
    ];

    const posts = await Promise.all(restaurants.map(r => r.log()));

    cache.time = moment().format('LLLL');
    cache.posts = posts;

    console.log('Writing cache at: ' + cache.time);
}

async function sendSlackMessage() {
    const url = `https://hooks.slack.com/services/${serviceId}`;
    const content = cache.posts.map(toSlackPost).join(`\n${'====='.repeat(20)}\n`);

    await axios.post(url, {text: content});
}

new CronJob('30 11 * * 0-6', async () => {
    console.log('Cron running...');
    await writeCache();
    await sendSlackMessage()
}, null, true, timezone);

app.get('/', async (req, res) => {
    res.json(cache);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
