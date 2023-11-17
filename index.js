const puppeteer = require('puppeteer');
const { compare } = require("odiff-bin");


const screens = [
    {
        current: 'https://gel.westpacgroup.com.au',
        next: 'https://gel-next-site-westpacgel.vercel.app',
        key: 'home'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/what-is-GEL',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/what-is-gel',
        key: 'what-is-gel'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/value-of-a-design-system',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/value-of-a-design-system',
        key: 'value-of-a-design-system'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/motion-principles',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/motion-principles',
        key: 'motion-principles'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/motion-principles',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/motion-principles',
        key: 'motion-principles'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/patterns',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/patterns',
        key: 'patterns'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/data-visualisation',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/data-visualisation',
        key: 'data-visualisation'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/accessible-by-design',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/accessible-by-design',
        key: 'accessible-by-design'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/typography',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/typography',
        key: 'typography'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/think-responsive',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/think-responsive',
        key: 'think-responsive'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/multi-brand-made-easy',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/multi-brand-made-easy',
        key: 'multi-brand-made-easy'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/iconography',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/iconography',
        key: 'iconography'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/colour',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/colour',
        key: 'colour'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/the-grid',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/the-grid',
        key: 'the-grid'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/using-fonts',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/using-fonts',
        key: 'using-fonts'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/design-with-GEL',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/design-with-gel',
        key: 'design-with-gel'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/figma-libraries',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/figma-libraries',
        key: 'figma-libraries'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/code-with-GEL',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/code-with-gel',
        key: 'code-with-gel'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/build-strong-brands',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/build-strong-brands',
        key: 'build-strong-brands'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/collaborate-for-change',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/collaborate-for-change',
        key: 'collaborate-for-change'
    },
    {
        current: 'https://gel.westpacgroup.com.au/articles/gel-design-approach',
        next: 'https://gel-next-site-westpacgel.vercel.app/articles/gel-design-approach',
        key: 'gel-design-approach'
    }
];

(async () => {
    const captureScreen = async (type, current, next, key) => {
        const screen = type === 'current' ? current : next;
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.setViewport({ width: 1728, height: 12720 });
        await page.goto(screen);
        await page.waitForFunction(() => document.readyState === "complete");
        await page.waitForTimeout(4000); // let images to load..
        await page.screenshot({
            path: `images/${key}-${type}.png`,
            // fullPage: true
        });
        return browser.close();
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


    // Capture screens in a sequence than parallel to avoid memory issues
    const captureScreens = async (type) => {
        for (const screen of screens) {
            await captureScreen(type, screen.current, screen.next, screen.key);
        }
    }

    await captureScreens('current');
    await captureScreens('next');

})();

