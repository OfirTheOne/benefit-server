

import { Page } from 'puppeteer';
import { sleep } from './sleep';

export async function clickWhileNotThrow(page: Page, selector: string) {
    const MAX_CALLS = 10;
    const DELAY_CALL = 1.5*1000;
    let calls = 0;
    let clickActionThrownError = false;
    while(!clickActionThrownError && calls < MAX_CALLS) {
        try {
            await page.click(selector);
            await sleep(DELAY_CALL);
        } catch (error) {
            clickActionThrownError = true;
        } finally{
            calls++;
        }
    }
}
