import {ALIGN, BORDER_STYLE, CONTENT_TYPE, ELEMENT_TYPE, LIST_STYLE} from "utils/enums";

export interface IPresentation {
	presentationId: string,
	editorIds: string[],
	name: string,
	background: string,
	fontFamily: string,
	description: string,
	lastUpdated: Date
}

export interface ILayout {
	x: number,
	y: number,
	width: number,
	height: number,
	rotation: number,
	[ key: string ]: any
}

export interface IFont {
	fontFamily: string,
	fontSize: number,
	letterSpacing: 'normal' | number,
	lineHeight: 'normal' | number,
	fontCase: 'normal' | 'uppercase' | 'lowercase',
	color: string,
	bold: boolean,
	italic: boolean,
	align: ALIGN,
	[ key: string ]: any
}

export interface IInsertion {
	tag: string,
	contentType: CONTENT_TYPE,
	listStyle?: LIST_STYLE
}

export interface IStyle {
	background: string,
	boxShadow: string,
	opacity: number,
	borderColor: string,
	borderRadius: number,
	borderWidth: number,
	borderStyle: BORDER_STYLE,
	[ key: string ]: any
}

export interface IElement {
	presentationId: string,
	slideId: string,
	elementId: string,
	name: string,
	layout: ILayout,
	font: IFont,
	style: IStyle,
	insertion: IInsertion,
	text: string,
	[ key: string ]: any
}

export interface ISlide {
	presentationId: string,
	slideId: string,
	name: string,
	index: number,
	elements: IElement[]
}
