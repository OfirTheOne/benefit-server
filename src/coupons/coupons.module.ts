import { Module } from '@nestjs/common';
import { CouponsRepository } from './repository/coupons.repository';
import { CouponsService } from './service/coupons.service';
import { CouponsController } from './coupons.controller';

@Module({
    providers: [
        CouponsRepository,
        CouponsService
    ],
    exports: [
        CouponsService
    ],
    controllers: [CouponsController]
})
export class CouponsModule {}
