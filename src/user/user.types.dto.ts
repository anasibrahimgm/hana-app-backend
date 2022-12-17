export class createUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export class loginUserDto {
  readonly email: string;
  readonly token: string;
}
