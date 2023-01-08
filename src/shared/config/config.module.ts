import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

const envFilePath = path.join('config', `${process.env.ENV || 'default'}.cfg`);

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath,
        })
    ],
    exports: [ConfigModule],
})
export class AppConfigModule { }
