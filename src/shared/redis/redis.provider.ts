import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType, SchemaFieldTypes } from 'redis';
import { RedisJSON } from '@redis/json/dist/commands';
import { RediSearchSchema } from '@redis/search';
import { Config } from '../../types/config.interface';
import { SubQueryBuilder } from './sub-query-builder/sub-query-builder.interface';

interface JsonSearchParams {
    limit?: {offset: number, num: number}
}

@Injectable()
export class RedisProvider {

    private _client: RedisClientType;

    constructor(private config: ConfigService<Config>) { }

    async initJsonIndexes() {
        try {
            return await this.createJsonIndex('idx:coupon', {
                '$.title': {
                    type: SchemaFieldTypes.TEXT,
                    AS: 'title'
                },
                '$.provider': {
                    type: SchemaFieldTypes.TAG,
                    AS: 'provider'
                },
                '$.description': {
                    type: SchemaFieldTypes.TEXT,
                    AS: 'description'
                },
                '$.priceText': {
                    type: SchemaFieldTypes.TEXT,
                    AS: 'priceText'
                }
            }, 'coupon');
        } catch (error) {
            if((<Error>error)?.message.includes('Index already exists')) {
                return 'OK';
            } else {
                throw error;
            }
        }
    }

    async initConnection() {
        try {
            this._client = createClient({url: this.config.get('REDIS_URL')});
            this._client.on('error', (err) => console.log('Redis client Error', err));
            await this._client.connect();            
            process.once('beforeExit', async () => {
                if (this._client) {
                    await this._client.quit();
                }
            })
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    protected createJsonIndex(index: string, schema: RediSearchSchema, prefix: string) {
        return this._client.ft.create(index, schema, 
            {
                ON: 'JSON',
                PREFIX: prefix
            }
        );
        
    }

    setJson<T extends RedisJSON>(key: string, value: T) {
        try {
            return this._client.json.set(key, '$', value)
        } catch (error) {
            console.error((<Error>error).message);
            throw error;
        }
    }

    getJson(docKey: string, jsonPath: string | Array<string> = '$') {
        try {
            return this._client.json.get(docKey, { path: jsonPath });
        } catch (error) {
            console.error((<Error>error).message);
            throw error;
        }
    }

    searchJson(index: string, subQueries: SubQueryBuilder[], options: JsonSearchParams) {
        const { limit } = options;
        const query = subQueries.map(subQ => subQ.build()).join(' ');
        try {
            console.log(query);
            return this._client.ft.search(index, query, 
                {
                    LIMIT: limit? { from: limit.offset, size: limit.num } : undefined 
                } 
            );
        } catch (error) {
            console.error((<Error>error).message);
            throw error;
        }
    }

}
