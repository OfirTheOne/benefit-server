import { Controller, Post, Get, Query, Param } from '@nestjs/common';
import { CouponProviderType } from '../types/coupon-provider-type.enum';
import { CouponsService } from './service/coupons.service';

@Controller('coupons')
export class CouponsController {
    constructor(private couponsService: CouponsService) {}
    
    // @Post()
    // addCoupon() {
    //     return this.couponsService.addCoupons();
    // }

    @Get('search')
    searchCoupon(@Query('text') text: string, @Query('provider') provider: CouponProviderType) {
        return this.couponsService.searchCoupons(text, ['title'], provider);
    }

    @Get('')
    async mainCoupons() {
        const providers = [
            CouponProviderType.HAPOALIM,
            CouponProviderType.PAIS
        ]
        const results = await Promise.all(
            providers.map(p => 
                this.couponsService.searchCoupons('', [], p, 0, 20)
                    .then(res => ([p, res] as const))
            )
        );
        return results.reduce((acc, [p, result]) => ({ ...acc, [p]: result }), {});
        
    }


    @Get(':group')
    async getCouponByGroup(@Param('group') group: string) {
        return this.couponsService.queryCouponsByGroup(group);
    }

    
    @Get('autocomplete')
    autocompleteCoupon(@Query('text') text: string, @Query('provider') provider: CouponProviderType) {
        return this.couponsService.autocompleteSearchCoupons(text, ['title'], provider);
    }
    
}
