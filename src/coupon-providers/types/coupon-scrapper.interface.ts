
export interface CouponScrapper<T> {
    scrap(): Promise<Array<T>> 
}