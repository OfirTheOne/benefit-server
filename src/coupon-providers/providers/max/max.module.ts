

import { Module } from '@nestjs/common';;
import {  MaxScrapper } from './max-scrapper';
import { MaxProcessor } from './max-processor';
import { MaxProvider } from './max.provider';
import { ScrapperModule } from '../../../shared/scrapper/scrapper.module';

@Module({
    providers: [
        MaxScrapper,
        MaxProcessor,
        MaxProvider
    ],
    imports: [
        ScrapperModule,
    ],
    exports: [
        MaxScrapper,
        MaxProcessor,
        MaxProvider
    ]
})
export class MaxModule { }
