import {model, Schema} from 'mongoose'
import {IUserDocument} from '../interface/user'

export const UserSchema = new Schema({
	userId: String,
	email: String,
	password: String
})

export const UserModel = model<IUserDocument>('user', UserSchema)
