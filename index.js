const express = require('express')
const app = express()
const port = 3000;

app.get('/', async (req, res) => {
    const restaurants = [
        require('./emalia'),
        // require('./ogrod'),
        // require('./szuwary'),
    ];

    const menu = await Promise.all([...restaurants.map(restaurant => restaurant.log())])

    res.send(menu.join('\n'));

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
