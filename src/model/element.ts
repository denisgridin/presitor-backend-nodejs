import {Document, model, Model, Schema} from "mongoose";
import {IContent, IElement} from "interface/presentation";
import {ALIGN, CONTENT_TYPE, ELEMENT_TYPE, LIST_STYLE} from "utils/enums";
import {FIELDS} from "utils/constants";


interface IElementDocument extends IElement, Document {}
interface IElementModel extends Model<IElementDocument>{}
const ElementSchema = new Schema({
	elementType: {
		type: ELEMENT_TYPE,
		requires: true,
		enum: [ ELEMENT_TYPE.CONTENT, ELEMENT_TYPE.SHAPE, ELEMENT_TYPE.IMAGE ]
	},
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
	}
})
export const ElementModel = model<IElementDocument>('element', ElementSchema)



interface IElementContentDocument extends IContent, Document {}
const ElementContentSchema = new Schema({
	insertion: {
		tag: String,
		contentType: String,
		listStyle: String
	},
	layout: {
		x: Number,
		y: Number,
		width: Number,
		height: Number,
		rotation: Number
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
}, {
	discriminatorKey: FIELDS.ELEMENT_TYPE
})
export const ElementContentModel = ElementModel.discriminator('content', ElementContentSchema)
