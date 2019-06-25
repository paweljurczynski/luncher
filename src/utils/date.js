const moment = require("moment/moment");

const weekDays = [1, 2, 3, 4, 5].map(day => moment().day(day).format('dddd').toLowerCase());

const isTodaysPost = post => new Date(post.time).toDateString() === new Date().toDateString();
const hasDayOffers = post => weekDays.some(day => post.content.toLowerCase().includes(day));
const getDayMenuFromPost = post => {
    const content = post.content.toLowerCase();
    const today = moment().format('dddd');
    const nextDay = moment().add(1, 'day').format('dddd');
    const nextDayIndex = content.includes(nextDay) ? content.indexOf(nextDay) : undefined;

    return post.content.slice(
        content.lastIndexOf(today),
        nextDayIndex
    );
};

module.exports = {
    isTodaysPost,
    hasDayOffers,
    getDayMenuFromPost
};
