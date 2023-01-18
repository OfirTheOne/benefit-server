import { Injectable } from '@nestjs/common';
import { Coupon } from '../../../types/coupon.interface';
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';
import { CouponProcessor } from '../../types/coupon-processor.interface';
import { HapoalimRawCoupon } from './hapoalim-raw-coupon.interface';

@Injectable()
export class HapoalimProcessor implements CouponProcessor<HapoalimRawCoupon> {
    process(rawData: Array<HapoalimRawCoupon>, type: CouponProviderType): Coupon[] {
        return rawData.map(c => {
            let image = '';
            if(c.image) {
                const relativeImagePath = c.image ? (c.image.match(/url\(\"(?<url>.+)\"\)/)?.groups?.url) || '' : '';
                const url = new URL('https://www.bankhapoalim.co.il' + relativeImagePath);
                image = url.origin + url.pathname;
            }
            return { 
                ...c, 
                image,
                provider: type,
                link: c.category.link, 
                category: c.category.title,
                systemCategories: []
            };
        });
    }
}


