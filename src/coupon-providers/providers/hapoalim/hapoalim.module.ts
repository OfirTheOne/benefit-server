

import { Module } from '@nestjs/common';;
import {  HapoalimScrapper } from './hapoalim-scrapper';
import { HapoalimProcessor } from './hapoalim-processor';
import { HapoalimProvider } from './hapoalim.provider';
import { ScrapperModule } from '../../../shared/scrapper/scrapper.module';

@Module({
    providers: [
        HapoalimScrapper,
        HapoalimProcessor,
        HapoalimProvider
    ],
    imports: [
        ScrapperModule,
    ],
    exports: [
        HapoalimScrapper,
        HapoalimProcessor,
        HapoalimProvider
    ]
})
export class HapoalimModule { }
