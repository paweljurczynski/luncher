require("dotenv").config();
require("moment/locale/pl");

const express = require("express");
const app = express();
const port = process.env.OPENSHIFT_NODEJS_PORT || 80;
const moment = require("moment-timezone");
const slack = require("./services/slack");
const restaurants = require("./data/restaurants");
const { retryable } = require("./utils/retryable");
const { merge } = require("rxjs");
const { CronJob } = require("cron");
const timezone = "Europe/Warsaw";

moment.tz.setDefault(timezone);

const fetchRestaurant = restaurant => retryable(restaurant);

function getPosts() {
  const tasks$ = restaurants.map(fetchRestaurant);

  return merge(...tasks$);
}

new CronJob(
  "40 18 * * 1-5",
  async () => {
    console.log("We'are starting to be hungry!");

    const posts$ = getPosts();

    posts$.subscribe(post => {
      slack.sendMessage(post);
    });
  },
  null,
  true,
  timezone
);

app.get("/", function(req, res) {
  res.send("I'm alive!");
});

app.listen(port, () => console.log(`Luncher app listening on port ${port}!`));
