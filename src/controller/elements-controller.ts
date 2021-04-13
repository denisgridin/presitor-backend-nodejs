import {Body, Delete, Get, JsonController, Param, Post, Put, Res, UseBefore} from "routing-controllers";
import {FIELDS, PATH} from "utils/constants";
import {Error} from "utils/Error";
import {MESSAGES} from "utils/messages";
import {errorCodes} from "utils/errorCodes";
import {log} from "utils/logger";
import {Response} from "express";
import {checkInstancesExisting, checkUserPresentationAccess} from "../middleware/middleware";
import {ElementContentModel, ElementModel} from "model/element";
import {IElement} from "interface/presentation";
import {ELEMENT_TYPE} from "utils/enums";
import uuid from "uuid-random";

@JsonController()
export class ElementsController {
	@UseBefore(checkInstancesExisting)
	@Get(PATH.elements.default)
	async getSlideElements(@Param(FIELDS.PRESENTATION_ID) presentationId: string, @Param(FIELDS.SLIDE_ID) slideId: string, @Res() res: Response) {
		try {
			log.debug('get slide elements')
			const contents = await ElementContentModel.find({presentationId, slideId})
			return res.json(contents)
		} catch (error) {
			log.error(error)
			return res.json(new Error(MESSAGES.ERROR_GET_ELEMENTS, errorCodes.element.elementsGet, error))
		}
	}
	
	
	@UseBefore(checkInstancesExisting)
	@UseBefore(checkUserPresentationAccess)
	@Post(PATH.elements.default)
	async createPresentationElement(@Param(FIELDS.PRESENTATION_ID) presentationId: string,
	                                @Param(FIELDS.SLIDE_ID) slideId: string,
	                                @Body() element: IElement, @Res() res: Response) {
		try {
			log.info('create element: ' + element)
			switch (element.elementType) {
				case ELEMENT_TYPE.CONTENT: {
					element.elementId = uuid();
					const result = await ElementContentModel.create(element)
					log.debug(result)
					return res.send(element.elementId)
				}
				default: {
					log.error(new Error(MESSAGES.ERROR_UNDEFINED_ELEMENT_TYPE, errorCodes.element.elementTypeUndefined))
					return res.json(new Error(MESSAGES.ERROR_UNDEFINED_ELEMENT_TYPE, errorCodes.element.elementTypeUndefined))
				}
			}
		} catch (error) {
			log.error(error)
			return res.json(new Error(MESSAGES.ERROR_ELEMENT_CREATE, errorCodes.element.elementCreate, error))
		}
	}
	
	
	@UseBefore(checkInstancesExisting)
	@UseBefore(checkUserPresentationAccess)
	@Put(PATH.elements.exact)
	async updatePresentationElement(@Param(FIELDS.PRESENTATION_ID) presentationId: string,
	                                @Param(FIELDS.SLIDE_ID) slideId: string,
	                                @Param(FIELDS.ELEMENT_ID) elementId: string,
	                                @Body() element: IElement, @Res() res: Response) {
		try {
			log.info('update element: ' + element)
			switch (element.elementType) {
				case ELEMENT_TYPE.CONTENT: {
					const result = await ElementContentModel.updateOne({ elementId }, element)
					log.debug(result)
					return result.nModified > 0 ? res.sendStatus(200) : res.json(new Error(MESSAGES.ERROR_UPDATE_ELEMENT, errorCodes.element.elementUpdate))
				}
				default: {
					log.error(new Error(MESSAGES.ERROR_UNDEFINED_ELEMENT_TYPE, errorCodes.element.elementTypeUndefined))
					return res.json(new Error(MESSAGES.ERROR_UNDEFINED_ELEMENT_TYPE, errorCodes.element.elementTypeUndefined))
				}
			}
		} catch (error) {
			log.error(error)
			return res.json(new Error(MESSAGES.ERROR_ELEMENT_UPDATE, errorCodes.element.elementUpdate, error))
		}
	}

	@UseBefore(checkInstancesExisting)
	@UseBefore(checkUserPresentationAccess)
	@Put(PATH.elements.exact)
	@Delete(PATH.elements.exact)
	async removeSlideElement (@Param(FIELDS.PRESENTATION_ID) presentationId: string,
	                                   @Param(FIELDS.SLIDE_ID) slideId: string,
	                                   @Param(FIELDS.ELEMENT_ID) elementId: string,
	                                   @Body() element: IElement, @Res() res: Response) {
		try {
			const result = await ElementModel.findOneAndDelete({ presentationId, slideId, elementId })
			log.debug(result)
			return
		} catch (error) {
			log.error(error)
			return res.json(new Error(MESSAGES.ERROR_REMOVE_ELEMENT, errorCodes.element.elementRemove, error))
		}
	}
	
}
