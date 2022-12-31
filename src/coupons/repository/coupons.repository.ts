import { Injectable, OnModuleInit } from '@nestjs/common';
import { Coupon } from '../../types/coupon.interface';
import { RedisProvider } from '../../shared/redis/redis.provider';
import { RedisJSON } from '@redis/json/dist/commands';
import { PromisePool } from '@supercharge/promise-pool';
import { SubQueryBuilder } from 'src/shared/redis/sub-query-builder/sub-query-builder.interface';


@Injectable()
export class CouponsRepository implements OnModuleInit {

    static readonly indexName = 'idx:coupon';
    static readonly indexDocPrefix = 'coupon';
    constructor(private redisProvider: RedisProvider) { }

    onModuleInit() { }

    async search(
        subQueries: SubQueryBuilder[],
        skip?: number,
        limit?: number
    ) {
        const parsedLimit = skip !== undefined && limit !== undefined ? { offset: skip, num: limit } : undefined;
        const result = await this.redisProvider.searchJson(CouponsRepository.indexName, subQueries, { limit: parsedLimit });
        return result
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

