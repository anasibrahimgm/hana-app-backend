export class createUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export class loggedInUserDto {
  readonly email: string;
  readonly token: string;
}

export class loginUserDto {
  readonly email: string;
  readonly password: string;
}
