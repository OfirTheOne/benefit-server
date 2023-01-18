

import { Module } from '@nestjs/common';
import { CouponProvidersService } from './service/coupon-providers.service';
import { PaisModule } from './providers/pais/pais.module';
import { PaisProvider } from './providers/pais/pais.provider';
import { HapoalimModule } from './providers/hapoalim/hapoalim.module';
import { HapoalimProvider } from './providers/hapoalim/hapoalim.provider';
import { MaxModule } from './providers/max/max.module';
import { MaxProvider } from './providers/max/max.provider';

@Module({
    providers: [
        HapoalimProvider,
        PaisProvider,
        MaxProvider,
        CouponProvidersService
    ],
    imports: [
        HapoalimModule,
        PaisModule,
        MaxModule
    ],
    exports: [
        HapoalimProvider,
        PaisProvider,
        MaxProvider,
        CouponProvidersService
    ]
})
export class CouponProvidersModule { }
