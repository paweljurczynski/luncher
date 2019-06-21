const {initBrowser} = require('../utils/pupetter');

async function getPostsByPageId(pageId) {
    const browser = await initBrowser();
    const page = await browser.newPage();
    await page.goto(`https://www.facebook.com/pg/${pageId}/posts/`);

    const posts = await page.evaluate(() => Array.from(document.querySelectorAll('[data-testid="post_message"]'))
        .map(post => {
            const header = post.previousElementSibling;
            const time = header.querySelector('[data-utime]').getAttribute('data-utime');

            return {
                time: new Date(+`${time}000`).getTime(),
                content: post.textContent
            };
        })
    );

    await browser.close();

    return posts;
}

module.exports = {getPostsByPageId};
