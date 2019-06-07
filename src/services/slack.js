const axios = require('axios/index');
const serviceId = process.env.SERVICE_ID;
const moment = require("moment-timezone");
const format = `HH:mm dddd, DD MMMM YYYY`;

function toSlackPost(post) {
    const date = post.content.time ? moment(+`${post.content.time}000`).format(format) : 'No date available!';

    return [
        `*${post.restaurant}*`,
        `Data postu: _${date}_`,
        `>${post.content.post}`
    ].join('\n')
}

async function sendMessage(posts) {
    const url = `https://hooks.slack.com/services/${serviceId}`;
    const content = posts.map(toSlackPost).join(`\n${'====='.repeat(20)}\n`);

    await axios.post(url, {text: content});
}

module.exports = {
    sendMessage
}
