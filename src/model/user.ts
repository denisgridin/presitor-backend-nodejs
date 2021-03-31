import {model, Schema} from 'mongoose'
import {IUserDocument} from 'interface/user'

export const UserSchema = new Schema({
	user_id: String,
	email: String,
	password: String
})

export const UserModel = model<IUserDocument>('user', UserSchema)
