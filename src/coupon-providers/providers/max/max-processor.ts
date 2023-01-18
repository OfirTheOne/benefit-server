import { Injectable } from '@nestjs/common';
import { Coupon } from '../../../types/coupon.interface';
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';
import { CouponProcessor } from '../../types/coupon-processor.interface';
import { MaxRawCoupon } from './max-raw-coupon.interface';

@Injectable()
export class MaxProcessor implements CouponProcessor<MaxRawCoupon> {
    process(rawData: Array<MaxRawCoupon>): Coupon[] {
        return rawData.map(c => {            
            return { 
                ...c, 
                image: c.image || '',
                provider: CouponProviderType.MAX,
                link: c.category.link, 
                category: c.category.title,
                systemCategories: []
            };
        });
    }
}


