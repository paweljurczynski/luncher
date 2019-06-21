require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const moment = require("moment-timezone");
const { CronJob } = require('cron');
const slack = require('./services/slack');
require("moment/locale/pl");
const restaurants = require('./data/restaurants');

const timezone = 'Europe/Warsaw';

moment.tz.setDefault(timezone);

async function getPosts() {
    return await Promise.all(restaurants.map(restaurant => {
        console.log(`Requesting ${restaurant.emoji} ${restaurant.name}...`);
        return restaurant.getter(restaurant);
    }));
}

(async() => {
    const posts = await getPosts();

    console.log(posts.filter(Boolean));

    // await slack.sendMessage(posts);
})();

app.listen(port, () => console.log(`Luncher app listening on port ${port}!`));
