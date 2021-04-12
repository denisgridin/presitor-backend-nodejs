import {Model, Document, Schema, model} from 'mongoose'
import {ISlide} from "model/slide";
import {IComment} from "model/comment";

export interface IPresentation {
	presentationId?: string,
	editorIds: string[],
	name: string,
	fillColor: string,
	fontFamily: string,
	slides?: ISlide[],
	comments?: IComment[],
	marks?: { [key: string]: number },
	lastUpdated: Date,
	description: string
}
interface IPresentationDocument extends IPresentation, Document {}
interface IPresentationModel extends Model<IPresentationDocument>{}

const PresentationSchema = new Schema({
	presentationId: String,
	editorIds: [String],
	name: String,
	fillColor: String,
	fontFamily: String,
	lastUpdated: Date,
	description: String
})

export const PresentationModel = model<IPresentationDocument>('presentation', PresentationSchema)
