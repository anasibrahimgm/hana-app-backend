import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { NextPrayerOptions, Prayer, TimeStr } from './prayer-times.types';

@Injectable()
export class PrayerTimesService {
  private async getTodayPrayers(): Promise<Prayer[]> {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1080, isMobile: false },
    });
    const page = await browser.newPage();

    await page.goto(
      'https://www.muslimpro.com/Prayer-times-Bremen-Germany-2944388',
    );

    let dayPrayersSelector = '.prayer-daily-table li';
    await page.waitForSelector(dayPrayersSelector);

    /*
    const btnCookiesRejectAll = await page.$('#onetrust-reject-all-handler');
    await btnCookiesRejectAll.screenshot({ path: 'btn.png' });
    await btnCookiesRejectAll.click();
    */

    const prayers: Prayer[] | any[] = await page.$$eval(
      dayPrayersSelector,
      (elements) =>
        elements.map((e) => ({
          name: e.querySelector('.waktu-solat').textContent,
          time: e.querySelector('.jam-solat').textContent,
        })),
    );
    await browser.close();

    for (let index = 0; index < prayers.length; index++) {
      const element: Prayer | any = prayers[index];
      element.time = this.getTimestampFromTimeStr(element.time);
    }

    return prayers;
  }

  async getNextPrayer(options?: NextPrayerOptions) {
    let escapeSunrise = false;
    if (options !== undefined && options.escapeSunrise !== undefined) {
      escapeSunrise = options.escapeSunrise;
    }

    let prayers: Prayer[] = await this.getTodayPrayers();

    prayers.sort((a, b) => a.time - b.time);

    let date = new Date();
    let now = date.getTime();

    let filtered = prayers.filter((a) => {
      if (a.name === 'Sunrise') {
        return !escapeSunrise;
      }

      return a.time > now;
    });

    return filtered[0];
  }

  private getTimestampFromTimeStr(str: TimeStr) {
    let date = new Date();
    let split = str.split(':');
    let hours = parseInt(split[0], 10);
    let minutes = parseInt(split[1], 10);

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.getTime();
  }
}
