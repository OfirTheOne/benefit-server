import { Injectable } from '@nestjs/common';
import { Scrapper } from '../../../shared/scrapper/scrapper.provider';
import { CouponScrapper } from '../../types/coupon-scrapper.interface';
import { Coupon } from '../../../types/coupon.interface';
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';


@Injectable()
export class PaisScrapper implements CouponScrapper {
    
    readonly type = CouponProviderType.PAIS;

    constructor(protected scrapper: Scrapper) { }

    async scrap(): Promise<Coupon[]> {
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
            const accCoupons: Array<Coupon> = [];
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
                accCoupons.push(
                    ...(coupons.map(c => ({
                        ...c, 
                        provider: this.type,
                        category: category.title,
                        subCategory: category.subTitle
                    })))
                );
            }
            return accCoupons;
        } catch (error) {
            console.log(error);
        } 
    }
}
