import { Module } from '@nestjs/common';
import { EXECUTABLE_PATH_TOKEN } from './consts';
import { Scrapper } from './scrapper.provider';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

@Module({
  providers: [
    {
        provide: EXECUTABLE_PATH_TOKEN,
        useValue: CHROME
    },
    Scrapper
],
  exports: [Scrapper],
})
export class ScrapperModule {}
