import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import * as path from 'path';

const envFilePath = path.join('config', `${process.env.ENV || 'default'}.cfg`);


@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath
        }),
        RedisModule,
    ],
    exports: [
        ConfigModule,
        RedisModule
    ]

})
export class SharedModule {}
