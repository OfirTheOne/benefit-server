import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CouponsService } from '../coupons/service/coupons.service';
import { CouponProviderType } from '../types/coupon-provider-type.enum';
import { Coupon } from '../types/coupon.interface';
import { HapoalimProvider } from '../coupon-providers/providers/hapoalim/hapoalim.provider';
import { PaisProvider } from '../coupon-providers/providers/pais/pais.provider';
import { CouponProvider } from '../coupon-providers/types/coupon-provider.interface';
import { MaxProvider } from '../coupon-providers/providers/max/max.provider';

@Injectable()
export class CouponsSource implements OnModuleDestroy {

    readonly supportedProviders: CouponProviderType[] = [
        CouponProviderType.HAPOALIM,
        CouponProviderType.PAIS
    ];

    constructor(
        private schedulerRegistry: SchedulerRegistry,
        protected hapoalimProvider: HapoalimProvider,
        protected paisProvider: PaisProvider,
        protected maxProvider: MaxProvider,
        protected couponsService: CouponsService
    ) { }

    onModuleDestroy() {
        const job = this.schedulerRegistry.getCronJob('sourceAll');
        if (job) {
            job.stop();
            console.log(job.lastDate());
        }
    }

    // @Cron('45 * * * * *', { name: 'sourceAll' })
    async sourceAll() {

        const providerServices: Array<{
            service: CouponProvider;
            field: string;
            result: Coupon[];
            provideError?: unknown
            sourceError?: unknown
        }> = [
                { service: this.hapoalimProvider, field: 'hapoalim', result: [] },
                { service: this.paisProvider, field: 'pais', result: [] },
                { service: this.maxProvider, field: 'max', result: [] }
            ];

        const finalResult: Record<string, any> = {};

        for (let providerService of providerServices) {
            try {
                const { service } = providerService;
                if (this.supportedProviders.includes(service.type)) {
                    const coupons: Coupon[] | undefined = await service.provide();
                    providerService.result = coupons;
                }
            } catch (error) {
                console.log(error);
                providerService.provideError = error;
            }
        }

        for (let providerService of providerServices) {
            const { result: scrapResult, field } = providerService;
            try {
                if (scrapResult && scrapResult.length) {
                    finalResult[field] = await this.couponsService.addCoupons(scrapResult);
                }
            } catch (error) {
                console.log(error);
                providerService.sourceError = error;
            }
        }
        return finalResult;
    }
}

