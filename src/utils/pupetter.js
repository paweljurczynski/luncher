const puppeteer = require("puppeteer");

async function initBrowser() {
    return await puppeteer.launch({
        'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
}

module.exports = { initBrowser };
