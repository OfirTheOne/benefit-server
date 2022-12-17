import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CouponsSourceModule } from './coupons-source/coupons-source.module';
import { SharedModule } from './shared/shared.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    CouponsSourceModule,
    SharedModule,
    CouponsModule
  ],
  controllers: [AppController],
})
export class AppModule {}
