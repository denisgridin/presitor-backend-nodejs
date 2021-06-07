import {Document, model, Model, Schema} from "mongoose";
import { IElement } from "../interface/presentation";
interface IElementDocument extends IElement, Document {}
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
		borderStyle: String,
		zIndex: Number
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
