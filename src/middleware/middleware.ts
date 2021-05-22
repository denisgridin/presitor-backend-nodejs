import { Request, Response } from "express";
import {log} from "../utils/logger";
import {getUserFromToken} from "../utils/helpers";
import {IPresentation, PresentationModel} from "../model/presentation";
import {Error} from "../utils/Error";
import {MESSAGES} from "../utils/messages";
import {errorCodes} from "../utils/errorCodes";
import {SlideModel} from "../model/slide";
import {ElementModel} from "../model/element";


export function loggingBody (request: Request, response: Response, next?: (err?: any) => any): any {
	const body = request.body
	log.info(request)
	log.info('Request body: ' + JSON.stringify(body))
	next()
}

export function loggingBefore (request: any, response: any, next?: (err?: any) => any): any {
	next();
}

export function loggingAfter (request: any, response: any, next?: (err?: any) => any): any {
	console.log('do something After...');
	next();
}

export async function checkUserPresentationAccess (request: Request, response: Response, next?: (err?: any) => any) {
	try {
		log.info('Check user access to presentation')
		const token = request.headers['authorization']?.split(' ')[1]
		const presentationId = request.body?.presentationId || request.query?.presentationId || request.params?.presentationId
		if (token) {
			log.debug('presentationId: ' + presentationId)
			log.debug('token: ' + token)
			const user = getUserFromToken(token)
			const presentation = await PresentationModel.findOne({ presentationId }) as IPresentation
			log.debug(presentation?.editorIds, user.userId)
			if (presentation?.editorIds.includes(user.userId)) {
				next()
			} else {
				log.error(new Error(MESSAGES.ERROR_PRESENTATION_ACCESS, errorCodes.presentation.presentationAccess))
				response.json(new Error(MESSAGES.ERROR_PRESENTATION_ACCESS, errorCodes.presentation.presentationAccess))
				next(false)
			}
		} else {
			next()
		}
	} catch (error) {
		log.error(error)
		response.json(new Error(MESSAGES.ERROR_PRESENTATION_ACCESS, errorCodes.presentation.presentationAccess))
		next(false)
	}
}

export async function checkInstancesExisting (request: Request, response: Response, next?: (err?: any) => any) {
	try {
		const presentationId = request.body?.presentationId || request.query?.presentationId || request.params.presentationId
		const slideId = request.body?.slideId || request.query?.slideId || request.params.slideId
		const elementId = request.body?.elementId || request.query?.elementId || request.params.elementId
		
		if (presentationId) {
			log.debug('Presentation found')
			const resultGetPresentation = await PresentationModel.findOne({ presentationId })
			if (resultGetPresentation) {
				if (slideId) {
					const resultGetSlide = await SlideModel.findOne({ slideId })
					if (resultGetSlide) {
						if (elementId) {
							const resultGetElements = await ElementModel.findOne({ elementId })
							if (resultGetElements) {
								next()
							} else {
								log.error(new Error(MESSAGES.ERROR_GET_ELEMENT, errorCodes.element.elementGet))
								response.json(new Error(MESSAGES.ERROR_GET_ELEMENT, errorCodes.element.elementGet))
							}
						} else {
							next()
						}
					} else {
						const error = new Error(MESSAGES.ERROR_GET_SLIDE, errorCodes.slide.slideGet)
						log.error(error)
						response.json(error)
					}
				} else {
					next()
				}
			} else {
				log.error(new Error(MESSAGES.ERROR_PRESENTATION_NOT_FOUND, errorCodes.presentation.notFound))
				response.json(new Error(MESSAGES.ERROR_PRESENTATION_NOT_FOUND, errorCodes.presentation.notFound))
				next(false)
			}
		} else {
			next()
		}
		
	} catch (error) {
		log.error(error)
	}
}
