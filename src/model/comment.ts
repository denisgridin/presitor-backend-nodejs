import {Model, Document, Schema, model} from 'mongoose'
import {ROLE} from "utils/enums";

export interface IComment {
	presentation_id: string,
	comment_id: string,
	role: ROLE,
	text: string,
	datetime: Date
}
interface ICommentDocument extends IComment, Document {}
interface ICommentModel extends Model<ICommentDocument>{}

const CommentSchema = new Schema({
	token: String
})

export const CommentModel = model<ICommentDocument>('comment', CommentSchema)
