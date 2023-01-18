import { CouponProviderType } from "src/types/coupon-provider-type.enum";
import { Coupon } from "../../types/coupon.interface";
import { CouponProcessor } from "./coupon-processor.interface";
import { CouponScrapper } from "./coupon-scrapper.interface";

export interface CouponProvider<T=unknown> {
    type: CouponProviderType;
    readonly processor: CouponProcessor<T>;
    readonly scrapper: CouponScrapper<T>;
    provide(): Promise<Coupon[]>;
}
