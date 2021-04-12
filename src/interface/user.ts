import { Document } from "mongoose"
import {IsEmail, MinLength} from "class-validator";

export interface IUser {
	userId?: string,
	email: string,
	password: string
}

export interface IUserDocument extends IUser, Document {}
