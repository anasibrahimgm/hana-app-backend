import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  createUserDto,
  loggedInUserDto as loggedInUserDto,
  loginUserDto,
} from './user.types.dto';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() dto: createUserDto): Promise<loggedInUserDto> {
    return this.userService.register(dto);
  }

  @Post('login')
  login(@Body() dto: loginUserDto): Promise<loggedInUserDto> {
    return this.userService.login(dto);
  }

  @Post('validatetoken')
  validateToken(@Body() dto: loggedInUserDto): Promise<boolean> {
    return this.userService.validateToken(dto);
  }
}
