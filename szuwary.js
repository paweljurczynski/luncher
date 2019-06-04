const puppeteer = require("puppeteer");

const restaurant = 'Szuwary';

async function log() {
    console.log(`Requesting ${restaurant}...`);

    const browser = await puppeteer.launch({
        'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();
    await page.goto("https://www.facebook.com/pg/SzuwaryCafe/posts/");

    const menu = await page.evaluate(() => {
        const lunchPost = Array.from(document.querySelectorAll('[data-testid="post_message"]')).find(
            post => {
                const header = post.previousElementSibling;
                const time = header.querySelector('[data-utime]').getAttribute('data-utime');
                const isLunchPost = ['zapraszamy', 'krem', 'makaron'].some(word => post.textContent.toLowerCase().includes(word));

                return new Date(+`${time}000`).toDateString() === new Date().toDateString() && isLunchPost;
            }
        );

        return lunchPost && lunchPost.textContent || 'Food not found. Stay hungry!';
    });

    await browser.close();
    return {
        restaurant,
        content: menu
    }
};

module.exports = {log};
