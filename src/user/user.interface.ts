import mongoose from 'mongoose';

export interface User {
  readonly id?: mongoose.Schema.Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
