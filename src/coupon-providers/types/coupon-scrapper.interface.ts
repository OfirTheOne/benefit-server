import { CouponProviderType } from "../../types/coupon-provider-type.enum";
import { Coupon } from "../../types/coupon.interface";

export interface CouponScrapper {

    type: CouponProviderType; 
    scrap(): Promise<Array<Coupon>> 
}