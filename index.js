const express = require('express')
const app = express()
const port = process.env.PORT || 80;

app.get('/', async (req, res) => {
    const restaurants = [
        require('./emalia'),
        require('./ogrod'),
        require('./szuwary'),
    ];

    const menu = await Promise.all([...restaurants.map(restaurant => restaurant.log())])

    res.json(menu);

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
