import { Injectable } from "@nestjs/common";
import { CouponProcessor } from "../../types/coupon-processor.interface";
import { Coupon } from "../../../types/coupon.interface";
import { PaisRawCoupon } from "./pais-raw-coupon.interface";
import { CouponProviderType } from '../../../types/coupon-provider-type.enum';

@Injectable()
export class PaisProcessor implements CouponProcessor<PaisRawCoupon> {
    constructor() { }

    process(rawData: PaisRawCoupon[], type: CouponProviderType): Coupon[] {
       return rawData.map(c => ({
        ...c, 
            provider: type,
            category: c.category.title,
            subCategory: c.category.subTitle,
            systemCategories: []
        }));
    }
}
