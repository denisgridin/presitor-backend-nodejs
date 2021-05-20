import {
	Authorized,
	Body, Delete,
	Get,
	HeaderParam,
	HeaderParams,
	JsonController, Param,
	Post,
	QueryParam,
	Res, UseBefore
} from "routing-controllers";
import {FIELDS, PATH} from "@/utils/constants";
import {log} from "@/utils/logger";
import {MESSAGES} from "@/utils/messages";
import {errorCodes} from "@/utils/errorCodes";
import {Error} from '@/utils/Error'
import {IPresentation, PresentationModel} from "model/presentation";
import {ISlide, SlideModel} from "@/model/slide";
import {Response} from "express";
import uuid from "uuid-random";
import {asyncForEach, getUserFromToken} from "@/utils/helpers";
import {checkInstancesExisting, checkUserPresentationAccess} from "@/middleware/middleware";
import {ElementModel} from "model/element";

@JsonController()
export class SlideController {
	@Get(PATH.slides.default)
	async getPresentationSlides (@Param(FIELDS.PRESENTATION_ID) presentationId: string, @Res() res) {
		try {
			const slides = await SlideModel.find({ presentationId })
			log.debug('slides', slides)
			const parsedSlides = slides.map((slide: ISlide) => {
				return {
					name: slide.name,
					slideId: slide.slideId,
					presentationId: slide.presentationId,
					index: slide.index
				}
			})
			log.debug(parsedSlides)
			return res.json(parsedSlides)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_GET_SLIDES, errorCodes.slide.slidesGet, error))
		}
	}
	
	@Authorized()
	@UseBefore(checkUserPresentationAccess)
	@Post(PATH.slides.default)
	async createPresentationSlide (@Body() slide: ISlide, @HeaderParam('authorization') token: string , @Res() res: Response) {
		try {
			const presentationSlides = await SlideModel.find({ presentationId: slide.presentationId })
			log.debug(presentationSlides)
			slide.slideId = uuid()
			slide.index = presentationSlides.length
			log.debug(slide)
			const result = await SlideModel.create(slide)
			log.debug(result)
			return res.send(slide.slideId)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_CREATE_SLIDE, errorCodes.slide.slideCreate))
		}
	}
	
	updateSlidesIndexesRecursive (presentationId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const slides = await SlideModel.find({ presentationId })
				await asyncForEach(slides, async (slide, index) => {
					slide.index = index
					await slide.save()
				})
				resolve('success')
			} catch (error) {
				log.error(error)
				reject(error)
			}
		})
	}
	
	@Authorized()
	@UseBefore(checkInstancesExisting)
	@UseBefore(checkUserPresentationAccess)
	@Delete(PATH.slides.exact)
	async removePresentationSlide (@Param(FIELDS.PRESENTATION_ID) presentationId: string, @Param(FIELDS.SLIDE_ID) slideId: string, @Res() res: Response) {
		try {
			const slide = await SlideModel.findOneAndDelete({ presentationId, slideId })
			await this.updateSlidesIndexesRecursive(presentationId)
			console.log('deleted: ' + slide)
			return res.sendStatus(200)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_DELETE_SLIDE, errorCodes.slide.deleteSlide, error))
		}
	}
}
