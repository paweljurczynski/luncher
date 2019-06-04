const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const moment = require("moment");
require("moment/locale/pl");

const format = 'HH:mm';
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
    const shouldWriteCache = moment().isBetween(moment('09:30:00', format), moment('12:00:00', format));

    if (shouldWriteCache) {
        await writeCache();
    }
}, 900000);

writeCache();

app.get('/', async (req, res) => {
    res.json(cache);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
