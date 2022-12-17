import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { User } from './user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

var validator = require('validator');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(user: User): Promise<User> {
    const email = user.email;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException({
        email: 'User with this email already exists.',
      });
    }

    if (validator.isEmail(email) === false) {
      throw new BadRequestException({
        email: 'invalid Email.',
      });
    }

    const newUser = new this.userModel(user);
    return await newUser.save();
  }
}
