import { Injectable, OnModuleInit } from '@nestjs/common';
import { Coupon } from '../../types/coupon.interface';
import { RedisProvider } from '../../shared/redis/redis.provider';
import { RedisJSON } from '@redis/json/dist/commands';
import { PromisePool } from '@supercharge/promise-pool';


@Injectable()
export class CouponsRepository implements OnModuleInit {

    static readonly indexName = 'idx:coupon';
    static readonly indexDocPrefix = 'coupon';
    constructor(private redisProvider: RedisProvider) { }

    onModuleInit() { }

    async search(text: string, fields: Array<string>, tags: {name: string, value: string}[]) {
        return this.redisProvider.searchJson(CouponsRepository.indexName, {
            textSearch: { text, fields },
            tags
        });
    }

    async add(id: string, coupon: Coupon) {
        return this.redisProvider.setJson(
            `${CouponsRepository.indexDocPrefix}:${id}`, 
            coupon as unknown as RedisJSON);
    }

    async addMany(coupons: Array<{ id: string, coupon: Coupon }>) {
        return PromisePool
            .withConcurrency(20)
            .for(coupons)
            .process(({ id, coupon }, _i, _pool) => {
                return this.add(id, coupon);
            });
    }
}

