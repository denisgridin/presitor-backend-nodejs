import {Document, model, Model, Schema} from "mongoose";
import {IContent, IElement, IShape} from "interface/presentation";
import {ALIGN, BORDER_STYLE, CONTENT_TYPE, ELEMENT_TYPE, LIST_STYLE} from "utils/enums";
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
	style: {
		backgroundColor: String,
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
}, {
	discriminatorKey: FIELDS.ELEMENT_TYPE
})
export const ElementContentModel = ElementModel.discriminator('content', ElementContentSchema)



interface IElementShapeDocument extends IShape, Document {}
const ElementShapeSchema = new Schema({
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
	text: String,
	style: {
		fillColor: String,
		boxShadow: String,
		opacity: Number,
		borderColor: String,
		borderRadius: String,
		borderWidth: String,
		borderStyle: String
	}
}, {
	discriminatorKey: FIELDS.ELEMENT_TYPE
})
export const ElementShapeModel = ElementModel.discriminator('shape', ElementShapeSchema)
