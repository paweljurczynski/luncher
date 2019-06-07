const { initBrowser } = require('../utils/pupetter');

async function one(name, pageId) {
    console.log(`Requesting ${name}...`);

    const browser = await initBrowser();
    const page = await browser.newPage();
    await page.goto(`https://www.facebook.com/pg/${pageId}/posts/`);

    const content = await page.evaluate(() => {
        const lunchPost = Array.from(document.querySelectorAll('[data-testid="post_message"]')).find(
            post => {
                const header = post.previousElementSibling;
                const time = header.querySelector('[data-utime]').getAttribute('data-utime');
                const isLunchPost = ['zapraszamy', 'krem', 'makaron', 'zupa'].some(word => post.textContent.toLowerCase().includes(word));

                return new Date(+`${time}000`).toDateString() === new Date().toDateString() && isLunchPost;
            }
        );

        const header = lunchPost.previousElementSibling;
        const time = header.querySelector('[data-utime]').getAttribute('data-utime');

        return {
            time,
            post: lunchPost && lunchPost.textContent || 'Food not found. Stay hungry!'
        }
    });

    await browser.close();

    return {
        restaurant: name,
        content
    }
};

module.exports = one;
