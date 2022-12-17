

import { Module } from '@nestjs/common';
import { ScrapperModule } from '../shared/scrapper/scrapper.module';
import { CouponProvidersService } from './service/coupon-providers.service';
import { pluggedScrappers } from './providers/plugged-scrappers';

@Module({
    providers: [
        ...pluggedScrappers,
        CouponProvidersService
    ],
    imports: [
        ScrapperModule,
    ],
    exports: [
        ...pluggedScrappers,
        CouponProvidersService
    ]
})
export class CouponProvidersModule { }
