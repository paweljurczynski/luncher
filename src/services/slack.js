const axios = require('axios/index');
const serviceId = process.env.SERVICE_ID;
const moment = require("moment-timezone");
const format = `HH:mm dddd, DD MMMM YYYY`;

function toSlackPost(post) {
    const date = moment(post.time).format(format);
    const content = post.content.split('\n').filter(line => line.trim()).join('\n>');

    return [
        `*${post.restaurant}*`,
        `Data postu: _${date}_`,
        `>${content}`,
    ].join('\n')
}

async function sendMessage(posts) {
    console.log('Sending slack message...');
    const url = `https://hooks.slack.com/services/${serviceId}`;
    const content = posts.map(toSlackPost).join(`\n${'====='.repeat(20)}\n`);

    await axios.post(url, {text: content});
}

module.exports = {
    sendMessage
}
