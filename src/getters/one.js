const facebook = require('../services/facebook');
const {isLunchPost} = require("../utils/knowledge");
const {isTodaysPost} = require("../utils/date");

async function one(restaurant) {
    const posts = await facebook.getPostsByPageId(restaurant.pageId);

    return posts.find(post => isTodaysPost(post) && isLunchPost(post));
};

module.exports = one;
