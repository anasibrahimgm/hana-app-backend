import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { NextPrayerOptions, Prayer, TimeStr } from './prayer-times.types';

@Injectable()
export class PrayerTimesService {
  private async getTodayPrayers(): Promise<any> {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1080, isMobile: false },
    });
    const page = await browser.newPage();

    await page.goto(
      'https://www.muslimpro.com/Prayer-times-Bremen-Germany-2944388',
    );

    /*
    const btnCookiesRejectAll = await page.$('#onetrust-reject-all-handler');
    await btnCookiesRejectAll.screenshot({ path: 'btn.png' });
    await btnCookiesRejectAll.click();
    */

    /*
    let dayPrayersSelector = '.prayer-daily-table li';
    await page.waitForSelector(dayPrayersSelector);

    const prayers: Prayer[] | any[] = await page.$$eval(
      dayPrayersSelector,
      (elements) =>
        elements.map((e) => ({
          name: e.querySelector('.waktu-solat').textContent,
          time: e.querySelector('.jam-solat').textContent,
        })),
    );
    // this old method doesn't work if asked about next prayer at the end of the day aka after Isha'a where next prayer is on the following day
    */

    let monthPrayersSelector = 'table.prayer-times';
    let todayRowSelector = `${monthPrayersSelector} tr.active`;

    await page.waitForSelector(monthPrayersSelector);

    const todayRow = await page.$(todayRowSelector);

    const tomorrowRow = await page.evaluateHandle(
      (el) => el.nextElementSibling,
      todayRow,
    );

    const todayPrayers = await tomorrowRow.$$eval('td.prayertime', (elements) =>
      elements.map((e) => e.textContent),
    );

    const tomorrowPrayers = await tomorrowRow.$$eval(
      'td.prayertime',
      (elements) => elements.map((e) => e.textContent),
    );

    await browser.close();

    let prayers: Prayer[] = [
      {
        name: 'Fajr',
        time: this.getTimestampFromTimeStr(todayPrayers[0]),
      },
      {
        name: 'Sunrise',
        time: this.getTimestampFromTimeStr(todayPrayers[1]),
      },
      {
        name: 'Dhuhr',
        time: this.getTimestampFromTimeStr(todayPrayers[2]),
      },
      { name: 'Asr', time: this.getTimestampFromTimeStr(todayPrayers[3]) },
      {
        name: 'Maghrib',
        time: this.getTimestampFromTimeStr(todayPrayers[4]),
      },
      {
        name: "Isha'a",
        time: this.getTimestampFromTimeStr(todayPrayers[5]),
      },
      {
        name: 'Fajr tomrrow',
        time:
          this.getTimestampFromTimeStr(tomorrowPrayers[0]) +
          1000 * 60 * 60 * 24,
      },
    ];

    return prayers;
  }

  async getNextPrayer(options?: NextPrayerOptions) {
    let escapeSunrise = true;
    if (options !== undefined && options.escapeSunrise !== undefined) {
      escapeSunrise = options.escapeSunrise;
    }

    let prayers: Prayer[] = await this.getTodayPrayers();

    prayers.sort((a, b) => a.time - b.time);

    let date = new Date();
    let now = date.getTime();

    let filtered = prayers.filter((a) => {
      if (a.time < now) {
        return false;
      }

      if (a.name === 'Sunrise') {
        return !escapeSunrise;
      }

      return true;
    });

    let nextPrayer: Prayer = filtered[0];
    let nextPrayerDate = new Date(nextPrayer.time);
    let msg =
      `Next prayer is ${nextPrayer.name} ` +
      `at ${nextPrayerDate.getHours()}:${nextPrayerDate.getMinutes()}`;

    return {
      nextPrayer,
      msg,
    };
  }

  private getTimestampFromTimeStr(str: TimeStr | any) {
    let date = new Date();
    let split = str.split(':');
    let hours = parseInt(split[0], 10);
    let minutes = parseInt(split[1], 10);

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.getTime();
  }
}
