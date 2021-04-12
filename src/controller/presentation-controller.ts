import {Authorized, Body, Delete, Get, JsonController, Post, QueryParam, Res} from "routing-controllers";
import {PATH} from "utils/constants";
import {IPresentation, PresentationModel} from "model/presentation";
import {MESSAGES} from "utils/messages";
import { Error } from 'utils/Error'
import uuid from "uuid-random";
import {Response} from "express";
import {errorCodes} from "utils/errorCodes";
import {log} from "utils/logger";

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
			return res.json(new Error(MESSAGES.ERROR_PRESENTATION_CREATE, errorCodes.presentation.userPresentationCreate, error))
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
				return res.json(new Error(MESSAGES.ERROR_QUERY_NOT_SET('userId'), errorCodes.presentation.userPresentationGet))
			}
		} catch (error) {
			log.error(error)
			return res.json(new Error(MESSAGES.ERROR_GET_USER_PRESENTATIONS, errorCodes.presentation.userPresentationGet, error))
		}
	}
	
	@Get(PATH.presentations.last)
	async getLastPresentations (@QueryParam('userId') userId: string, @Res() res: Response) {
		try {
			if (userId) {
				const presentations = await this.getUserPresentations(userId)
				return res.json(presentations.slice(-6))
			} else {
				return res.json(new Error(MESSAGES.ERROR_QUERY_NOT_SET('userId'), errorCodes.presentation.userPresentationGet))
			}
		} catch (error) {
			log.error(error)
			return res.json(new Error(MESSAGES.ERROR_GET_USER_PRESENTATIONS, errorCodes.presentation.userPresentationGet, error))
		}
	}
}
