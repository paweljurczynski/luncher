const { initBrowser } = require('../utils/pupetter');
const moment = require("moment/moment");
require("moment/locale/pl");

async function batchSmall(name, pageId) {
    console.log(`Requesting ${name}...`);
    const browser = await initBrowser();

    const page = await browser.newPage();
    await page.goto(`https://www.facebook.com/pg/${pageId}/posts/`);
    const currentDay = moment().format("dddd");
    const nextDay = moment().add(1, "day").format("dddd");
    const days = [1, 2, 3, 4, 5].map(day => moment().day(day).format('dddd').toLowerCase());

    const content = await page.evaluate((currentDay, nextDay, days) => {
        const post = Array.from(document.querySelectorAll('[data-testid="post_message"]'))
            .find(node => [...days, 'lunch'].every(text => node.textContent.toLowerCase().includes(text)));

        const header = post.previousElementSibling;
        const time = header.querySelector('[data-utime]').getAttribute('data-utime');

        if (!post) {
            return 'Food not found. Stay hungry!';
        }

        const nextDayIndex = post.textContent.toLowerCase().indexOf(nextDay);

        return {
            time,
            post: post.textContent.substring(
                post.textContent.toLowerCase().indexOf(currentDay),
                nextDayIndex > -1 ? nextDayIndex : undefined
            )
        };
    }, currentDay, nextDay, days);

    await browser.close();

    return {
        restaurant: name,
        content
    }
}

module.exports = batchSmall;
