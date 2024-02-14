/* eslint-disable no-unused-vars */
import {  Model } from "mongoose";

export interface TUser  {
  id: string;
  email:string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export type NewUser = {
  password: string;
  role: string;

}

export interface UserModel extends Model<TUser>{
  // myStaticMethod(): number;
  isUserExistsByCustomId(id:string):Promise<TUser>;
  isPasswordMatched(plainTextPassword:string,hashedPassword:string):Promise<boolean>;
  // isDeleted()
  isJWTIssuedBeforePasswordChanged(passwordChangedTimestamp: Date,jwtIssuedTimestamp: number):boolean;
}