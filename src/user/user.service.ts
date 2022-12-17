import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from './user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { loginUserDto } from './user.types.dto';
import { jwtPrivateKey } from 'src/config';

var validator = require('validator');
var jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(user: User): Promise<loginUserDto> {
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
    await newUser.save();

    if (!newUser) {
      throw new InternalServerErrorException(`User couldn't be created.`);
    }

    return await this.getUserDataForLogin(newUser);
  }

  private async getUserDataForLogin(user: User): Promise<loginUserDto> {
    let token = jwt.sign(
      { data: user.id },
      jwtPrivateKey,
      {
        expiresIn: '30d',
      },
      /*  ,
      (error, result) => {
        if (result !== null && result !== '' && result !== undefined) {
          console.log('result', result);
          token = result;
        }
        if (error !== null && error !== '' && error !== undefined) {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }, */
    );

    return { email: user.email, token };
  }
}
