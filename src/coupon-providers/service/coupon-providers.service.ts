import { Injectable } from '@nestjs/common';
import { CouponProviderType } from '../../types/coupon-provider-type.enum';

interface CouponProviderItem {
    type: CouponProviderType;
    displayName: string;
    enabled: boolean;
}

const source: Array<CouponProviderItem> = [
    {
        type: CouponProviderType.HAPOALIM,
        displayName: 'הפועלים',
        enabled: true
    }
]

@Injectable()
export class CouponProvidersService {

    constructor() {}

    async getSupportedCouponProviders(): Promise<CouponProviderItem[]> {
        return source.filter(item => item.enabled);
    }

}

