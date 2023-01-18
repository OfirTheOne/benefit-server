import { Injectable } from "@nestjs/common";
import { CouponProvider } from "../../types/coupon-provider.interface";
import { CouponProviderType } from "../../../types/coupon-provider-type.enum";
import { Coupon } from "../../../types/coupon.interface";
import { PaisRawCoupon } from "./pais-raw-coupon.interface";
import { PaisScrapper } from "./pais-scrapper";
import { PaisProcessor } from "./pais-processor";

@Injectable()
export class PaisProvider implements CouponProvider<PaisRawCoupon> {
    public readonly type = CouponProviderType.PAIS;
    constructor(
        public readonly processor: PaisProcessor,
        public readonly scrapper: PaisScrapper,
    ) {}
    async provide(): Promise<Coupon[]> {
        const rawCoupons = await this.scrapper.scrap();
        return this.processor.process(rawCoupons, this.type);
    }
}