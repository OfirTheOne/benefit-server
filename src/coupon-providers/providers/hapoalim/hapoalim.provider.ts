import { Injectable } from "@nestjs/common";
import { CouponProvider } from "../../types/coupon-provider.interface";
import { Coupon } from "../../../types/coupon.interface";
import { HapoalimRawCoupon } from "./hapoalim-raw-coupon.interface";
import { CouponProviderType } from "../../../types/coupon-provider-type.enum";
import { HapoalimScrapper } from "./hapoalim-scrapper";
import { HapoalimProcessor } from "./hapoalim-processor";

@Injectable()
export class HapoalimProvider implements CouponProvider<HapoalimRawCoupon> {
    public readonly type = CouponProviderType.HAPOALIM;
    constructor(
        public readonly processor: HapoalimProcessor,
        public readonly scrapper: HapoalimScrapper,
    ) {}
    async provide(): Promise<Coupon[]> {
        const rawCoupons = await this.scrapper.scrap();
        return this.processor.process(rawCoupons, this.type);
    }
}