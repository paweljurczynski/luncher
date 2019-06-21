const facebook = require('../services/facebook');
const {hasDayOffers, getMealFromPost} = require("../utils/date");

async function batch(restaurant) {
    const posts = await facebook.getPostsByPageId(restaurant.pageId);
    const post = posts.find(post => hasDayOffers(post));

    return {
        ...post,
        content: getMealFromPost(post)
    };
}

module.exports = batch;
