import {Model, Document, Schema, model} from 'mongoose'

interface IToken { token: string }
interface ITokenDocument extends IToken, Document {}
interface ITokenModel extends Model<ITokenDocument>{}

const TokenSchema = new Schema({ token: String })

export const TokenModel = model<ITokenDocument>('token', TokenSchema)
