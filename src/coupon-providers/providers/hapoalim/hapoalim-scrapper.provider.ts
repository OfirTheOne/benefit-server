import { Injectable } from '@nestjs/common';
import { Scrapper } from '../../../shared/scrapper/scrapper.provider';
import { CouponScrapper } from '../../../coupon-providers/types/coupon-scrapper.interface';
import { Coupon } from '../../../types/coupon.interface';
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';
import { Browser } from 'puppeteer';


@Injectable()
export class HapoalimScrapper implements CouponScrapper {
    
    readonly type = CouponProviderType.HAPOALIM;

    constructor(protected scrapper: Scrapper) { }

    async scrap(): Promise<Coupon[]> {
        let browser: Browser;
        try {
            browser = await this.scrapper.launchBrowser();
            
            let page = await browser.newPage();
            page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
            await page.goto('https://www.bankhapoalim.co.il/he/Poalim-Wonder');
            const catagories = await page.$$eval(
                "main div.links-gallery.paragraph-bottom-margin.paragraph-section > div > div > div > div > ul > li > a",
                catAnchors => catAnchors.map(a => ({ link: a.href, title: a.outerText }))
            );
            const accCoupons: Array<Coupon> = [];
            for (const category of catagories) {
                await page.goto(category.link);
                console.log('navigating to %s', category.link);
                const coupons = await page.$$eval(
                    "#team-members-container > div.team-member",
                    couponCards => couponCards.map(div => ({
                        link: '', 
                        image: '', 
                        title: div.querySelector('.team-member-title').innerHTML,
                        priceText: div.querySelector('div.team-member-subtitle').innerHTML,
                        description: ''
                    }))
                );
                    
                accCoupons.push(
                    ...(coupons.map(c => ({ 
                        ...c, 
                        provider: this.type,
                        link: category.link, 
                        category: category.title
                    })))
                );
                console.log(coupons);

            }
            return accCoupons;
        } catch (error) {
            console.log(error);
        } finally{
            if (browser != null && typeof browser.close == 'function') {
                await browser.close();
            }
            
        }
    }
}
