import { Injectable } from '@nestjs/common';
import { Scrapper } from '../../../shared/scrapper/scrapper.provider';
import { CouponScrapper } from '../../types/coupon-scrapper.interface';
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';
import { Browser } from 'puppeteer';
import { HapoalimRawCoupon } from './hapoalim-raw-coupon.interface';

@Injectable()
export class HapoalimScrapper implements CouponScrapper<HapoalimRawCoupon> {
    
    readonly type = CouponProviderType.HAPOALIM;
    constructor(protected scrapper: Scrapper) { }

    async scrap(): Promise<HapoalimRawCoupon[]> {
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
            const rawCoupons: Array<HapoalimRawCoupon> = [];
            for (const category of catagories) {
                await page.goto(category.link);
                console.log('navigating to %s', category.link);
                const coupons = await page.$$eval(
                    "#team-members-container > div.team-member",
                    couponCards => couponCards.map(div => {
                        const divImg = div.querySelector('.team-member-img'); 
                        const backImg = divImg?.['style']?.["background-image"];
                        return {
                            link: '', 
                            image: backImg,
                            title: div.querySelector('.team-member-title').innerHTML,
                            priceText: div.querySelector('div.team-member-subtitle').innerHTML,
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


