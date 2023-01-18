import { Injectable } from '@nestjs/common';
import { Scrapper } from '../../../shared/scrapper/scrapper.provider';
import { CouponScrapper } from '../../types/coupon-scrapper.interface';
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';
import { Browser } from 'puppeteer';
import { MaxRawCoupon } from './max-raw-coupon.interface';
import { clickWhileNotThrow } from '../../../shared/utils/click-while-not-throw';


const SELECTORS = {
    CATEGORIES: "body > app-root > app-main-layout > section > section > app-benfits > app-lobby > div > div.hidden-nav-links > a",
    SHOW_MORE_COUPONS_BUTTON: "body > app-root > app-main-layout > section > section > app-benfits > app-benefits-category > div > div.content-wrapper > div > div > span",
    COUPON_CARD: "body > app-root > app-main-layout > section > section > app-benfits > app-benefits-category > div > div.content-wrapper > div > div > div > div",
    COUPON_CARD_SELECTORS: {
        IMAGE: '.benfit-pic',
        INFO: '.benfit-info'
    }
} as const;

const SCRAP_START_POINT_SRC = 'https://www.max.co.il/benefits/lobby';

@Injectable()
export class MaxScrapper implements CouponScrapper<MaxRawCoupon> {
    
    readonly type = CouponProviderType.MAX;
    constructor(protected scrapper: Scrapper) { }

    async scrap(): Promise<MaxRawCoupon[]> {
        let browser: Browser;
        try {
            browser = await this.scrapper.launchBrowser();
            let page = await browser.newPage();
            page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
            await page.goto(SCRAP_START_POINT_SRC);
            const catagories = await page.$$eval(
                SELECTORS.CATEGORIES,
                catAnchors => catAnchors.map(a => ({ link: a.href, title: a.innerHTML }))
            );
            
            const rawCoupons: Array<MaxRawCoupon> = [];
            for (const category of catagories) {
                await page.goto(category.link);
                console.log('navigating to %s', category.link);
                await clickWhileNotThrow(page, SELECTORS.SHOW_MORE_COUPONS_BUTTON);

                const coupons = await page.$$eval(SELECTORS.COUPON_CARD,
                    couponCards => couponCards.map(div => {
                        const img = div.querySelector(SELECTORS.COUPON_CARD_SELECTORS.IMAGE); 
                        const infoDiv = div.querySelector(SELECTORS.COUPON_CARD_SELECTORS.INFO);
                        // @ts-ignore 
                        const backImg = img?.src;
                        return {
                            link: '', 
                            image: backImg,
                            title: infoDiv.querySelector('h2').innerHTML,
                            priceText: infoDiv.querySelector('p').innerHTML,
                            description: ''
                        };
                    })
                );
                    
                rawCoupons.push(
                    ...coupons.map(c => ({ ...c, category }))
                );
            }
            return rawCoupons;
        } catch (error) {
            console.log(error);
        } finally{
            if (browser != null && typeof browser.close == 'function') {
                await browser.close();
            }
            
        }
    }
}


