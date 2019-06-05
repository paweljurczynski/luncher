const moment = require("moment/moment");
require("moment/locale/pl");
const format = `HH:mm dddd, DD MMMM YYYY`;

function toSlackPost(post) {
    const date = +`${post.content.time}000`;

    return [
        `*${post.restaurant}*`,
        `Data postu: _${moment(date).format(format)}_`,
        `>${post.content.post}`
    ].join('\n')
}

module.exports = {
    toSlackPost
};
