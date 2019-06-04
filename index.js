const express = require('express');
const app = express();
const port = process.env.PORT || 80;

let cache = [];

async function writeCache() {
    const restaurants = [
        require('./emalia'),
        require('./ogrod'),
        require('./szuwary')
    ];

    cache = await Promise.all(restaurants.map(r => r.log()))
}

setTimeout(writeCache, 900000);

writeCache();

app.get('/', async (req, res) => {
    res.json(cache);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
