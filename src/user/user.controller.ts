import { Body, Controller, Get, Post } from '@nestjs/common';
import { createUserDto, loginUserDto } from './user.types.dto';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() dto: createUserDto): Promise<loginUserDto> {
    return this.userService.register(dto);
  }
}
