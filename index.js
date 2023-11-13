const puppeteer = require('puppeteer');
const { compare } = require("odiff-bin");


const screens = [
    {
        current: 'https://gel.westpacgroup.com.au/articles/colour',
        next: 'https://gel-next-site.vercel.app/articles/colour',
        key: 'colour'
    }
];

(async () => {
    const captureScreens = async (type) => {
        await Promise.all(
            screens.map(async ({current, next, key}) => {
                const screen = type === 'current' ? current : next;
                const browser = await puppeteer.launch({headless: false});
                const page = await browser.newPage();
                await page.setViewport({ width: 576, height: 12720 });
                await page.goto(screen);
                await page.waitForFunction(() => document.readyState === "complete");
                await page.screenshot({
                    path: `images/${key}-${type}.png`,
                    // fullPage: true
                });
                return browser.close();
            })
        );
    }

    const compareScreens = () => {
        screens.map(async ({key, current, next}) => {
            const { match, reason } = await compare(
                `images/${key}-current.png`,
                `images/${key}-next.png`,
                `diff/${key}-diff.png`
            );

            if(!match) {
                console.warn(`${current} screenshot do not match with ${next}`, reason);
            }
        })
    }


    await captureScreens('current');
    await captureScreens('next');
    compareScreens();


    console.log('capturing screenshots completed');
})();

