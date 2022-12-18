import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from './user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { loggedInUserDto, loginUserDto } from './user.types.dto';
import { jwtPrivateKey } from 'src/config';

var validator = require('validator');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async register(user: User): Promise<loggedInUserDto> {
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

    let salt = await bcrypt.genSalt(13);
    let hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = new this.userModel({
      name: user.name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (!newUser) {
      throw new InternalServerErrorException(`User couldn't be created.`);
    }

    return await this.getUserDataForLogin(newUser);
  }

  async login(dto: loginUserDto): Promise<loggedInUserDto> {
    const email = dto.email;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        email: `User with this email doesn't exist`,
      });
    }

    let passwordCompare = await bcrypt.compare(dto.password, user.password);
    if (!passwordCompare) {
      throw new BadRequestException({
        password: `Incorrect password.`,
      });
    }

    return await this.getUserDataForLogin(user);
  }

  private async getUserDataForLogin(user: User): Promise<loggedInUserDto> {
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
