import { Test, TestingModule } from '@nestjs/testing';
import { PrayerTimesService } from './prayer-times.service';

describe('PrayerTimesService', () => {
  let service: PrayerTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrayerTimesService],
    }).compile();

    service = module.get<PrayerTimesService>(PrayerTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
