import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { dbConfig } from './config';

import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, MongooseModule.forRoot(dbConfig.uri)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
