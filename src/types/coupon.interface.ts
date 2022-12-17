import { CouponProviderType } from "./coupon-provider-type.enum";

export interface Coupon {
    title: string,
    description: string,
    link: string,
    priceText: string,
    provider: CouponProviderType,
    category?: string,
    subCategory?: string,
    image?: string,
    content?: string,
}
