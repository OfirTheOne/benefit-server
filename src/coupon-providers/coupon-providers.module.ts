

import { Module } from '@nestjs/common';
import { CouponProvidersService } from './service/coupon-providers.service';
import { PaisModule } from './providers/pais/pais.module';
import { HapoalimModule } from './providers/hapoalim/hapoalim.module';
import { HapoalimProvider } from './providers/hapoalim/hapoalim.provider';
import { PaisProvider } from './providers/pais/pais.provider';

@Module({
    providers: [
        HapoalimProvider,
        PaisProvider,
        CouponProvidersService
    ],
    imports: [
        HapoalimModule,
        PaisModule
    ],
    exports: [
        HapoalimProvider,
        PaisProvider,
        CouponProvidersService
    ]
})
export class CouponProvidersModule { }
