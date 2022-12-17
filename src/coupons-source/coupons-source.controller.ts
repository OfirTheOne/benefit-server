import { Controller, Post } from '@nestjs/common';
import { CouponsSource } from './coupons-source';

@Controller('coupons-source')
export class CouponsSourceController {
    constructor(private couponsSource: CouponsSource) {}
    
    @Post()
    addCoupon() {
        return this.couponsSource.sourceAll();
    }
}
