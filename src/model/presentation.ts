import {Model, Document, Schema, model} from 'mongoose'
import {ISlide} from "../model/slide";
import {IComment} from "../model/comment";

export interface IPresentation {
	presentationId?: string,
	editorIds: string[],
	name: string,
	background: string,
	fontFamily: string,
	userId?: string,
	slides?: ISlide[],
	comments?: IComment[],
	marks?: { [key: string]: number },
	slideIndex?: number,
	lastUpdated: Date,
	description: string
}
interface IPresentationDocument extends IPresentation, Document {}
interface IPresentationModel extends Model<IPresentationDocument>{}

const PresentationSchema = new Schema({
	presentationId: String,
	editorIds: [String],
	name: String,
	background: String,
	fontFamily: String,
	lastUpdated: Date,
	description: String,
	slideIndex: Number
})

export const PresentationModel = model<IPresentationDocument>('presentation', PresentationSchema)
