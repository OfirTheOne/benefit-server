import { Injectable } from '@nestjs/common';
import { IncludeTextQuery, MatchTagQuery, MatchTextStartWithQuery } from '../../shared/redis/sub-query-builder/sub-query-builder';
import { createUniqueId } from '../../shared/utils/create-unique-id';
import { CouponsRepository } from '../repository/coupons.repository';
import { CouponProviderType } from '../../types/coupon-provider-type.enum';
import { Coupon } from '../../types/coupon.interface';


@Injectable()
export class CouponsService {

    constructor(private couponsRepository: CouponsRepository) { }

    async queryCouponsByGroup(group: string) {
        switch (group) {
            case CouponProviderType.HAPOALIM:
            case CouponProviderType.PAIS: 
                return this.couponsRepository.search([
                    new MatchTagQuery().setArgs('provider', group),  
                ], 0, 20)
                .then(res => res.documents.map(({id, value}) => ({ id, ...value })));
            default:        
        }
    }

    async searchCoupons(
        text: string,
        field: string | Array<string>,
        provider: CouponProviderType,
        skip?: number, limit?: number,
    ): Promise<{
        total: number;
        result: Array<Coupon & {id:string}>;
    }> {
        const searchResult = await this.couponsRepository.search([
            new MatchTagQuery().setArgs('provider', provider),  
            new IncludeTextQuery().setArgs(field, text),  
        ], skip, limit);
        return {
            result: searchResult.documents.map(({id, value}) => ({ id, ...value } as Coupon & {id:string})), 
            total: searchResult.total
        }
    }

    async autocompleteSearchCoupons(
        text: string,
        field: string | Array<string>,
        provider: CouponProviderType
    ) {
        if(text.length < 3) {
            return { total: 0, documents: [] };
        }
        return this.couponsRepository.search([
            new MatchTagQuery().setArgs('provider', provider),  
            new MatchTextStartWithQuery().setArgs(field, text),  
        ], 0, 5);
    }

    async addCoupons(coupons: Coupon[]) {
        return await this.couponsRepository.addMany(coupons.map(coupon => ({
            id: createUniqueId(),
            coupon
        })));
    }

}

