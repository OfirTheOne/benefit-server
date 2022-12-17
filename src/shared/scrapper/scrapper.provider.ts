import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { EXECUTABLE_PATH_TOKEN } from './consts';
import * as puppeteer from 'puppeteer';


@Injectable()
export class Scrapper implements OnModuleInit {

    protected _browser: puppeteer.Browser;
    get browser(): puppeteer.Browser {
        return this._browser;
    }
    
    constructor(@Inject(EXECUTABLE_PATH_TOKEN) protected executablePath: string) { }

    async onModuleInit() {
    }

    launchBrowser(): Promise<puppeteer.Browser> {
        return puppeteer.launch({
            executablePath: this.executablePath,
            headless: true,
            // headless: false,
            ignoreHTTPSErrors: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--shm-size=1gb']
        });
    }

}
