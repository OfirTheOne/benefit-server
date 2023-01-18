

import { Module } from '@nestjs/common';
import { PaisScrapper } from './pais-scrapper';
import { PaisProcessor } from './pais-processor';
import { PaisProvider } from './pais.provider';
import { ScrapperModule } from '../../../shared/scrapper/scrapper.module';

@Module({
    providers: [
        PaisScrapper,
        PaisProcessor,
        PaisProvider
    ],
    imports: [
        ScrapperModule,
    ],
    exports: [
        PaisScrapper,
        PaisProcessor,
        PaisProvider
    ]
})
export class PaisModule { }
