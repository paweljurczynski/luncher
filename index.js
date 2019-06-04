const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const serviceId = process.env.SERVICE_ID;
const moment = require("moment-timezone");
const axios = require('axios');
const cron = require('node-cron');

require("moment/locale/pl");

const timezone = 'Europe/Warsaw';

moment.tz.setDefault(timezone);

const cache = {};

async function writeCache() {
    const restaurants = [
        require('./emalia'),
        require('./ogrod'),
        require('./szuwary')
    ];

    const posts = await Promise.all(restaurants.map(r => r.log()));

    cache.time = moment().format('LLLL');
    cache.posts = posts;

    console.log('Writing cache at: ' + cache.time);
}

function toSlackPost(item) {
    return `*${item.restaurant}*\n${item.content}`;
}

async function sendSlackMessage() {
    const url = `https://hooks.slack.com/services/${serviceId}`;
    const content = cache.posts.map(toSlackPost).join('\n\n');

    await axios.post(url, {text: content});

    console.log('Send message to slack!');
}

console.log('registering cron');

// cron.schedule('0 24 13 * * *', async () => {
//     console.log('Cron running...');
//     await writeCache();
//     await sendSlackMessage()
// }, {
//     timezone
// });

cron.schedule('47 17 * * 1-5', () => console.log('dupa'), {
    scheduled: true,
    timezone: 'Europe/Warsaw'
});

app.get('/', async (req, res) => {
    res.json(cache);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
