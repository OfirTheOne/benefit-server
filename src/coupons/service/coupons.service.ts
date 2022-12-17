import { Injectable } from '@nestjs/common';
import { CouponProviderType } from 'src/types/coupon-provider-type.enum';
import { createUniqueId } from '../../shared/utils/create-unique-id';
import { Coupon } from '../../types/coupon.interface';
import { CouponsRepository } from '../repository/coupons.repository';

@Injectable()
export class CouponsService {

    constructor(private couponsRepository: CouponsRepository) { }

    async searchCoupons(
        text: string,
        field: string | Array<string>,
        provider: CouponProviderType
    ) {
        const textIncluded = `*${text.replace('*', '')}*`;
        return this.couponsRepository.search(
            textIncluded,
            Array.isArray(field) ? field : [field],
            [{ name: 'provider', value: `${provider || ''}` }]
        );
    }


    async autocompleteSearchCoupons(
        text: string,
        field: string | Array<string>,
        provider: CouponProviderType
    ) {
        if(text.length < 3) {
            return { total: 0, documents: [] };
        }
        const autocompleteText = `${text.replace('*', '')}*`;
        return this.couponsRepository.search(
            autocompleteText,
            Array.isArray(field) ? field : [field],
            [{ name: 'provider', value: provider ? `${provider}` : undefined }]
        );
    }

    async addCoupons(coupons: Coupon[]) {
        return await this.couponsRepository.addMany(coupons.map(coupon => ({
            id: createUniqueId(),
            coupon
        })));
    }

    async blah() {
        // await this.couponsRepository.add('123', {
        //     title: 'מסעדה',
        //     description: 'מסעדה אאאא',
        //     link: 'http://momo.com',
        //     priceText: 'עד 100 שח',
        // });
        // await this.couponsRepository.add('1235', {
        //     title: 'המבורגר מסעדה',
        //     description: 'מסעדה אאאא המבורגר ',
        //     link: 'http://momo.com',
        //     priceText: 'עד 150 שח',
        // });
        // await this.couponsRepository.add('123', {
        //     title: 'my doc 01',
        //     description: 'my doc 01 desc',
        //     link: 'http://momo.com',
        //     priceText: '100'
        // });
        // await this.couponsRepository.add('1235', {
        //     title: 'my doc 02',
        //     description: 'my doc 02 desc',
        //     link: 'http://momo.com',
        //     priceText: '100'
        // });
    }
}

