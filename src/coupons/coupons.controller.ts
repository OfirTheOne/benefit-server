import { Controller, Post, Get, Query } from '@nestjs/common';
import { CouponProviderType } from '../types/coupon-provider-type.enum';
import { CouponsService } from './service/coupons.service';

@Controller('coupons')
export class CouponsController {
    constructor(private couponsService: CouponsService) {}
    
    @Post()
    addCoupon() {
        return this.couponsService.blah();
    }

    @Get('search')
    searchCoupon(@Query('text') text: string, @Query('provider') provider: CouponProviderType) {
        return this.couponsService.searchCoupons(text, ['title'], provider);
    }
    
    @Get('autocomplete')
    autocompleteCoupon(@Query('text') text: string, @Query('provider') provider: CouponProviderType) {
        return this.couponsService.autocompleteSearchCoupons(text, ['title'], provider);
    }
    
}
