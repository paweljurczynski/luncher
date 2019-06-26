const {initBrowser} = require('../utils/pupetter');

async function getPostsByPageId(pageId) {
    const browser = await initBrowser();
    const page = await browser.newPage();
    await page.goto(`https://www.facebook.com/pg/${pageId}/posts/`);

    const posts = await page.evaluate(async () => {
            return Array.from(document.querySelectorAll('[data-testid="post_message"]'))
                .map(post => {
                    const header = post.previousElementSibling;
                    const time = header.querySelector('[data-utime]').getAttribute('data-utime');
                    const exposedLink = post.querySelector('.text_exposed_link a');

                    // Expanding post
                    [...post.querySelectorAll('.text_exposed_show')].forEach(el => el.classList.remove('text_exposed_show'));

                    return {
                        time: new Date(+`${time}000`).getTime(),
                        content: post.innerText,
                        exposedLink: exposedLink && !exposedLink.classList.contains('see_more_link')? exposedLink.getAttribute('href') : null
                    }
                });
        }
    );

    for await(let post of posts) {
        if (!post.exposedLink) {
            delete post.exposedLink;
            break;
        }

        const exposedPage = await browser.newPage();

        await exposedPage.goto(`https://facebook.com/pg${post.exposedLink}`);

        const exposedPost = await exposedPage.evaluate(() => {
            const post = document.querySelector('[data-testid="post_message"]');
            return post ? post.innerText : null;
        });

        if (exposedPost) {
            post.content = exposedPost;
        }
    }

    await browser.close();

    return posts;
}

module.exports = {getPostsByPageId};
