import {Body, Delete, Get, JsonController, Param, Post, Put, Req, Res, UseBefore} from "routing-controllers";
import {FIELDS, PATH} from "../utils/constants";
import {Error} from '../utils/Error';
import {MESSAGES} from "../utils/messages";
import {errorCodes} from '../utils/errorCodes'
import {log} from "../utils/logger";
import {Response} from "express";
import {checkInstancesExisting, checkUserPresentationAccess} from "../middleware/middleware";
import { ElementModel } from "../model/element";
import {IElement} from "../interface/presentation";
import uuid from "uuid-random";
import axios from 'axios'
import * as fs from "fs"
import bodyParser from "body-parser";
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const FormData = require('form-data')

const pick = require('lodash.pick')

@JsonController()
export class ElementsController {
	@UseBefore(checkInstancesExisting)
	@Get(PATH.elements.default)
	async getSlideElements(@Param(FIELDS.PRESENTATION_ID) presentationId: string, @Param(FIELDS.SLIDE_ID) slideId: string, @Res() res: Response) {
		try {
			log.debug('get slide elements')
			const contents = await ElementModel.find({presentationId, slideId})
			const elements = [ ...contents ].map(element => pick(element, [
				FIELDS.PRESENTATION_ID,
				FIELDS.SLIDE_ID,
				FIELDS.ELEMENT_ID,
				FIELDS.ELEMENT_TYPE,
				FIELDS.NAME,
				FIELDS.INSERTION,
				FIELDS.LAYOUT,
				FIELDS.FONT,
				FIELDS.TEXT,
				FIELDS.STYLE
			]))
			return res.json(elements)
		} catch (error) {
			log.error(error)
			return res.status(400).json(new Error(MESSAGES.ERROR_GET_ELEMENTS, errorCodes.element.elementsGet, error))
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
			element.elementId = uuid();
			const result = await ElementModel.create(element)
			log.debug(result)
			return res.send(element.elementId)
		} catch (error) {
			log.error(error)
			return res.status(400).json(new Error(MESSAGES.ERROR_ELEMENT_CREATE, errorCodes.element.elementCreate, error))
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
			const result = await ElementModel.updateOne({ elementId }, element)
			log.debug(result)
			return result.n > 0 ? res.sendStatus(200) : res.status(400).json(new Error(MESSAGES.ERROR_UPDATE_ELEMENT, errorCodes.element.elementUpdate))
		} catch (error) {
			log.error(error)
			return res.status(400).json(new Error(MESSAGES.ERROR_ELEMENT_UPDATE, errorCodes.element.elementUpdate, error))
		}
	}

	@UseBefore(checkInstancesExisting)
	@UseBefore(checkUserPresentationAccess)
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
			return res.status(400).json(new Error(MESSAGES.ERROR_REMOVE_ELEMENT, errorCodes.element.elementRemove, error))
		}
	}
	
	@Post(PATH.elements.file)
	@UseBefore(multipartMiddleware)
	async uploadFile (@Res() res: Response, @Req() request) {
		try {
			console.log(request.files)
			console.log(request.body)
			// const data = new FormData()
			// data.append('key', request.body.key)
			// data.append('image', request.files.image)
			console.log(request.body)
			console.log(typeof request.files.image)
			console.log(request.files)
			const image = fs.createReadStream(request.files.image.path)
			const data = new FormData()
			data.append('key', request.body.key)
			data.append('image', image)
			console.dir(data.getBoundary())
			const response = await axios.post(process.env.IMGBB_HOST,
				data,
				{
					headers: data.getHeaders()
				}
			)
			log.debug(response.data)
			delete request.files
			return response.data
		} catch (error) {
			log.error(error.response || error)
			return res.status(400).json(error)
		}
	}
}

