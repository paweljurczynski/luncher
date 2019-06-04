const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const moment = require("moment-timezone");
require("moment/locale/pl");

const format = 'HH:mm';
const timezone = 'Europe/Warsaw';
const startTime = '09:30:00';
const endTime = '12:00:00';
const intervalTime = 15 * 60 * 1000;

moment.tz.setDefault(timezone);

let cache = {};

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

setInterval(async () => {
    const shouldWriteCache = moment().isBetween(moment(startTime, format), moment(endTime, format));

    if (shouldWriteCache) {
        await writeCache();
    }
}, intervalTime);

writeCache();

app.get('/', async (req, res) => {
    res.json(cache);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
