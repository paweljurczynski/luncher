require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const moment = require("moment-timezone");
const slack = require('./services/slack');
require("moment/locale/pl");
const restaurants = require('./data/restaurants');
const { retryable } = require("./utils/retryable");

const timezone = 'Europe/Warsaw';

moment.tz.setDefault(timezone);

function fetchRestaurant(restaurant) {
    console.log(`Requesting ${restaurant.emoji} ${restaurant.name}...`);
    return retryable(restaurant);
}

function getPosts() {
    const tasks$ = restaurants.map(fetchRestaurant);

    return merge(...tasks$);
}


const posts$ = getPosts();

posts$.subscribe(post => {
    console.log(post);
});

// await slack.sendMessage(posts);


app.listen(port, () => console.log(`Luncher app listening on port ${port}!`));
