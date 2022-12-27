import { Controller, Get } from '@nestjs/common';
import { PrayerTimesService } from './prayer-times.service';

@Controller('api/prayers/')
export class PrayerTimesController {
  constructor(private readonly service: PrayerTimesService) {}

  @Get('next-prayer')
  getNextPrayer() {
    return this.service.getNextPrayer({ escapeSunrise: true });
  }
}
