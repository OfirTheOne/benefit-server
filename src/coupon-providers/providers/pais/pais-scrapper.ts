import { Injectable } from '@nestjs/common';
import { Scrapper } from '../../../shared/scrapper/scrapper.provider';
import { CouponScrapper } from '../../types/coupon-scrapper.interface';
import { PaisRawCoupon } from './pais-raw-coupon.interface';


@Injectable()
export class PaisScrapper implements CouponScrapper<PaisRawCoupon> {
    
    constructor(protected scrapper: Scrapper) { }

    async scrap(): Promise<PaisRawCoupon[]> {
        try {
            const browser = await this.scrapper.launchBrowser();
            let page = await browser.newPage();
            await page.goto('https://paisplus.co.il/');
            const groupedCatagories = await page.$$eval("#main-menu > div",
                catDivs =>  catDivs.slice(4, -1)
                .map(div => Array.from(div.querySelectorAll("div.list_wrap > ul > li > a").values())
                    .map(a => ({ 
                        href: a.getAttribute('href'), 
                        subTitle: a.innerHTML,
                        title: div.querySelector("a > div.title").innerHTML,
                    })), 
                )
            );
            const catagories = groupedCatagories.reduce((accCats, cat) => accCats.concat(cat));    
            const rawCoupons: Array<PaisRawCoupon> = [];
            for (const category of catagories) {
                await page.goto(category.href);
                const coupons = await page.$$eval(
                    "#main-content > div > div.b_page_category > div > div.cards_wrapper > ul > li",
                    couponCards => couponCards.map(li => ({
                        link: li.querySelector('a')?.href, 
                        image: li.querySelector('a > div.card_img > div.img_inner > img')?.getAttribute('src'),
                        title: li.querySelector('a > div.card_content > h3.card_title')?.innerHTML,
                        priceText: li.querySelector('a > div.card_content > p.card_price')?.innerHTML,
                        description: '',
                    }))
                );
                rawCoupons.push(...coupons.map(c => ({ ...c, category })));
            }
            return rawCoupons;
        } catch (error) {
            console.log(error);
        } 
    }
}

