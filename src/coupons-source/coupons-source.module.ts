import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CouponsModule } from '../coupons/coupons.module';
import { CouponProvidersModule } from '../coupon-providers/coupon-providers.module';
import { CouponsSource } from './coupons-source';
import { CouponsSourceController } from './coupons-source.controller';

@Module({
    imports: [
        CouponProvidersModule,
        CouponsModule,
        ScheduleModule.forRoot(),
    ],
    providers: [
        CouponsSource
    ],
    exports: [
        CouponsSource
    ],
    controllers: [
        CouponsSourceController
    ]
})
export class CouponsSourceModule { }
