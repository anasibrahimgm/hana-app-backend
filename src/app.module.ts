import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { dbConfig } from './config';

import { UserModule } from './user/user.module';
import { PrayerTimesService } from './prayer-times/prayer-times.service';
import { PrayerTimesController } from './prayer-times/prayer-times.controller';

@Module({
  imports: [UserModule, MongooseModule.forRoot(dbConfig.uri)],
  controllers: [AppController, PrayerTimesController],
  providers: [AppService, PrayerTimesService],
})
export class AppModule {}
