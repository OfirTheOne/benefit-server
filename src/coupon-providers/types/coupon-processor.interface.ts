import { Coupon } from "../../types/coupon.interface";

export interface CouponProcessor<T=unknown> {
    process(rawData: Array<T>, ...args: unknown[]): Array<Coupon>;
}

