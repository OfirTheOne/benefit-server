import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CouponsService } from '../coupons/service/coupons.service';
import { CouponScrapper } from '../coupon-providers/types/coupon-scrapper.interface';
import { PaisScrapper } from '../coupon-providers/providers/pais/pais-scrapper.provider';
import { HapoalimScrapper } from '../coupon-providers/providers/hapoalim/hapoalim-scrapper.provider';
import { CouponProviderType } from '../types/coupon-provider-type.enum';
import { Coupon } from '../types/coupon.interface';

@Injectable()
export class CouponsSource implements OnModuleDestroy {

    constructor(
        private schedulerRegistry: SchedulerRegistry,
        protected hapoalimScrapper: HapoalimScrapper,
        protected paisScrapper: PaisScrapper,
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
        const supportedProviders: CouponProviderType[] = [
            CouponProviderType.HAPOALIM, 
            CouponProviderType.PAIS
        ];

        const providerServices = [
            {
                service: this.hapoalimScrapper,
                field: 'hapoalim',
                result: [] as Coupon[]
            },
            {
                service: this.paisScrapper,
                field: 'pais',
                result: [] as Coupon[]
            }
        ];

        const finalResult: Record<string, any> = {};

        for (let providerService of providerServices) {
            try {
                const { service } = providerService;
                const coupons: Coupon[] | undefined = await this.scrap(supportedProviders, service);
                providerService.result = coupons;
            } catch (error) {
                console.log(error);
            }
        }
        
        for (let { result: scrapResult, field } of providerServices) {
            try {
                if (scrapResult && scrapResult.length) {
                    finalResult[field] = await this.couponsService.addCoupons(scrapResult);
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        return finalResult;
    }

    async scrap(providers: CouponProviderType[], scrapper: CouponScrapper): Promise<Coupon[] | undefined> {
        return providers.includes(scrapper.type) ?
            await scrapper.scrap().catch((e) => {
                console.log(`Error scraping, %s`, (<Error>e).message);
                return undefined;
            }) : undefined;
    }

}

