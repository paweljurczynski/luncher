const facebook = require('../services/facebook');
const {hasDayOffers, getDayMenuFromPost } = require("../utils/date");

async function batch(restaurant) {
    const posts = await facebook.getPostsByPageId(restaurant.pageId);
    const lunchPost = posts.find(post => hasDayOffers(post));

    if(lunchPost) {
        return {
            ...lunchPost,
            content: getDayMenuFromPost(lunchPost),
            restaurant: `${restaurant.emoji} ${restaurant.name}`
        }
    }
}

module.exports = batch;
