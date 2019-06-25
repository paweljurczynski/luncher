require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const moment = require("moment-timezone");
const slack = require('./services/slack');
require("moment/locale/pl");
const restaurants = require('./data/restaurants');

const timezone = 'Europe/Warsaw';

moment.tz.setDefault(timezone);

function fetchRestaurant(restaurant) {
    console.log(`Requesting ${restaurant.emoji} ${restaurant.name}...`);
    return restaurant.getter(restaurant);
}

async function getPosts() {
    const tasks = restaurants.map(fetchRestaurant);
    const posts = await Promise.all(tasks);

    return posts.filter(Boolean);
}

(async() => {
    const posts = await getPosts();

    await slack.sendMessage(posts);
})();

app.listen(port, () => console.log(`Luncher app listening on port ${port}!`));
