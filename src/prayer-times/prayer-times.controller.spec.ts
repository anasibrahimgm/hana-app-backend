import { Test, TestingModule } from '@nestjs/testing';
import { PrayerTimesController } from './prayer-times.controller';

describe('PrayerTimesController', () => {
  let controller: PrayerTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayerTimesController],
    }).compile();

    controller = module.get<PrayerTimesController>(PrayerTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
