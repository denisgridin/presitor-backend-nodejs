import {
	Authorized,
	Body,
	Delete,
	Get,
	JsonController,
	Param,
	Post,
	QueryParam,
	Res,
	UseBefore
} from "routing-controllers";
import {FIELDS, PATH} from "utils/constants";
import {IPresentation, PresentationModel} from "model/presentation";
import {MESSAGES} from "utils/messages";
import { Error } from 'utils/Error'
import uuid from "uuid-random";
import {Response} from "express";
import {errorCodes} from "utils/errorCodes";
import {log} from "utils/logger";
import {checkInstancesExisting, checkUserPresentationAccess} from "../middleware/middleware";
import * as Path from "path";

@Authorized()
@JsonController()
export class PresentationController {
	@Post(PATH.presentations.default)
	async createPresentation (@Body() data: IPresentation, @Res() res) {
		try {
			const presentation: IPresentation = data
			presentation.presentationId = uuid()
			presentation.lastUpdated = new Date()
			await PresentationModel.create(presentation)
			return res.send(presentation.presentationId)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_PRESENTATION_CREATE, errorCodes.presentation.userPresentationCreate, error))
		}
	}
	
	@Post(PATH.presentations.exact)
	async updatePresentation (@Body() presentation: IPresentation, @Res() res) {
		try {
			log.info('find presentation ' + presentation.presentationId)
			const result = await PresentationModel.findOneAndUpdate(
				{
					presentationId: presentation.presentationId
				},
				presentation
			)
			log.debug(result)
			return res.sendStatus(200)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_PRESENTATION_UPDATE, errorCodes.presentation.presentationUpdate, error))
		}
	}
	
	public getUserPresentations (userId: string): Promise<IPresentation[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const presentationDocuments = await PresentationModel.find({ editorIds: userId })
				const presentations: IPresentation[] = presentationDocuments.map((el: IPresentation) => {
					return {
						name: el.name,
						fillColor: el.fillColor,
						fontFamily: el.fontFamily,
						presentationId: el.presentationId,
						editorIds: el.editorIds,
						lastUpdated: el.lastUpdated,
						description: el.description
					}
				})
				resolve(presentations)
			} catch (error) {
				log.error(error)
				reject(error)
			}
		})
	}
	
	@Get(PATH.presentations.default)
	async getPresentations (@QueryParam('userId') userId: string, @Res() res: Response) {
		try {
			if (userId) {
				const presentations = await this.getUserPresentations(userId)
				return res.json(presentations)
			} else {
				return res.status(500).json(new Error(MESSAGES.ERROR_QUERY_NOT_SET('userId'), errorCodes.presentation.userPresentationGet))
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_GET_USER_PRESENTATIONS, errorCodes.presentation.userPresentationGet, error))
		}
	}
	
	@Get(PATH.presentations.exact)
	async getPresentation (@Param(FIELDS.PRESENTATION_ID) presentationId: string, @Res() res: Response) {
		try {
			const presentation = await PresentationModel.findOne({ presentationId }) as IPresentation
			if (presentation) {
				return res.json({
					name: presentation.name,
					presentationId: presentation.presentationId,
					lastUpdated: presentation.lastUpdated,
					editorIds: presentation.editorIds,
					fillColor: presentation.fillColor,
					fontFamily: presentation.fontFamily
				})
			} else {
				log.error(new Error(MESSAGES.ERROR_PRESENTATION_NOT_FOUND, errorCodes.presentation.notFound))
				return res.status(500).json(new Error(MESSAGES.ERROR_PRESENTATION_NOT_FOUND, errorCodes.presentation.notFound))
			}
		}	catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_PRESENTATION_NOT_FOUND, errorCodes.presentation.notFound, error))
		}
	}
	
	@Authorized()
	@UseBefore(checkInstancesExisting)
	@UseBefore(checkUserPresentationAccess)
	@Delete(PATH.presentations.exact)
	async removePresentation (@Param(FIELDS.PRESENTATION_ID) presentationId: string, @Res() res: Response) {
		try {
			const result = await PresentationModel.findOneAndDelete({ presentationId })
			log.debug(result)
			return res.sendStatus(200)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_PRESENTATION_REMOVE, errorCodes.presentation.presentationRemove, error))
		}
	}
	
	@Get(PATH.presentations.default)
	async getLastPresentations (@QueryParam('userId') userId: string, @Res() res: Response) {
		try {
			if (userId) {
				const presentations = await this.getUserPresentations(userId)
				return res.json(presentations.slice(-6))
			} else {
				return res.status(500).json(new Error(MESSAGES.ERROR_QUERY_NOT_SET('userId'), errorCodes.presentation.userPresentationGet))
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_GET_USER_PRESENTATIONS, errorCodes.presentation.userPresentationGet, error))
		}
	}
}
