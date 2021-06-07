import { Document, Schema, model } from 'mongoose'

export interface ISlide {
	presentationId: string,
	slideId: string,
	name: string,
	index?: number,
	elements?: string[]
}
interface ISlideDocument extends ISlide, Document {}

const SlideSchema = new Schema({
	presentationId: String,
	slideId: String,
	name: String,
	index: Number,
})

export const SlideModel = model<ISlideDocument>('slide', SlideSchema)
