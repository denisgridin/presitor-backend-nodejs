import {IsString} from "class-validator";

export class TokenValidation {
	@IsString()
	token: string
	
	getToken (): string {
		return this.token
	}
}
