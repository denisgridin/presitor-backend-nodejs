import {IsEmail, MinLength} from "class-validator";

export class UserValidation {
	@IsEmail()
	email: string
	
	@MinLength(6)
	password: string
	
	userId?: string
}
