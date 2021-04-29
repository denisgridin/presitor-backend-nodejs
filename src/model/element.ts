import {Document, model, Model, Schema} from "mongoose";
import { IElement } from "interface/presentation";
import {ALIGN, BORDER_STYLE, CONTENT_TYPE, ELEMENT_TYPE, LIST_STYLE} from "utils/enums";
import {FIELDS} from "utils/constants";


interface IElementDocument extends IElement, Document {}
interface IElementModel extends Model<IElementDocument>{}
const ElementSchema = new Schema({
	presentationId: String,
	slideId: String,
	elementId: String,
	name: String,
	layout: {
		x: Number,
		y: Number,
		width: Number,
		height: Number,
		rotation: Number,
	},
	insertion: {
		tag: String,
		contentType: String,
		listStyle: String
	},
	style: {
		background: String,
		boxShadow: String,
		opacity: Number,
		borderColor: String,
		borderRadius: Number,
		borderWidth: Number,
		borderStyle: String
	},
	font: {
		fontFamily: String,
		fontSize: Number,
		letterSpacing: Number,
		lineHeight: Number,
		fontCase: String,
		color: String,
		bold: Boolean,
		italic: Boolean,
		align: String
	},
	text: String
})
export const ElementModel = model<IElementDocument>('element', ElementSchema)
