const facebook = require('../services/facebook');
const {isLunchPost} = require("../utils/knowledge");
const {isTodaysPost} = require("../utils/date");

async function one(restaurant) {
    const posts = await facebook.getPostsByPageId(restaurant.pageId);
    const lunchPost = posts.find(post => isTodaysPost(post) && isLunchPost(post));

    if(lunchPost) {
        return {
            ...lunchPost,
            restaurant: `${restaurant.emoji} ${restaurant.name}`
        }
    }
};

module.exports = one;
