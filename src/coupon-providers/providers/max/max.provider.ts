import { Injectable } from "@nestjs/common";
import { CouponProvider } from "../../types/coupon-provider.interface";
import { Coupon } from "../../../types/coupon.interface";
import { MaxRawCoupon } from "./max-raw-coupon.interface";
import { CouponProviderType } from "../../../types/coupon-provider-type.enum";
import { MaxScrapper } from "./max-scrapper";
import { MaxProcessor } from "./max-processor";

@Injectable()
export class MaxProvider implements CouponProvider<MaxRawCoupon> {
    public readonly type = CouponProviderType.MAX;
    constructor(
        public readonly processor: MaxProcessor,
        public readonly scrapper: MaxScrapper,
    ) {}
    async provide(): Promise<Coupon[]> {
        const rawCoupons = await this.scrapper.scrap();
        return this.processor.process(rawCoupons);
    }
}