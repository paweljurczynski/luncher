const puppeteer = require("puppeteer");
const moment = require("moment");
require("moment/locale/pl");

const restaurant = 'Emalia';

async function log() {
    console.log(`Requesting ${restaurant}...`);

    const browser = await puppeteer.launch({
        'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();
    await page.goto("https://www.facebook.com/pg/Emaliazablocie/posts/");
    const currentDay = moment().format("dddd");
    const nextDay = moment().add(1, "day").format("dddd");
    const days = [1, 2, 3, 4, 5].map(day => moment().day(day).format('dddd').toLowerCase());

    const menu = await page.evaluate((currentDay, nextDay, days) => {
        const menuNode = Array.from(document.querySelectorAll('[data-testid="post_message"]'))
            .find(node => [...days, 'lunch'].every(text => node.textContent.toLowerCase().includes(text)));

        if (!menuNode) {
            return 'Food not found. Stay hungry!';
        }

        const nextDayIndex = menuNode.textContent.toLowerCase().indexOf(nextDay);
        return menuNode.textContent.substring(
            menuNode.textContent.toLowerCase().indexOf(currentDay) + currentDay.length,
            nextDayIndex > -1 ? nextDayIndex : undefined
        );
    }, currentDay, nextDay, days);

    await browser.close();

    return {
        restaurant,
        content: menu
    }
}

module.exports = {log};
