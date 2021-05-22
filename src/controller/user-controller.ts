import {Body, Delete, Get, JsonController, Param, Post, QueryParam, Res} from 'routing-controllers';
import 'reflect-metadata';
import {PATH, TOKEN_EXPIRATION} from "../utils/constants.js"
import {UserModel} from "../model/user"
import {log} from "../utils/logger";
import { Response } from 'express'
import {MESSAGES} from "../utils/messages";
import {Error} from "../utils/Error";
import {comparePassword, cryptPassword, findExistUser} from "../utils/helpers";
import {TokenModel} from "../model/token";
import {TokenValidation} from "../validators/token";
import {UserValidation} from "../validators/user";
import uuid from 'uuid-random'
import {errorCodes} from "../utils/errorCodes";
const jwt = require('jsonwebtoken')

@JsonController()
export class UserController {
	@Get('/users/:id')
	getOne (@Param('id') id: number) {
		return 'This action returns user #' + id;
	}
	
	@Post(PATH.auth.registration)
	async addUser (@Body() user: UserValidation, @Res() res: Response) {
		try {
			if (await findExistUser(user.email)) {
				return res.status(400).send(new Error(MESSAGES.ERROR_USER_EXISTS, errorCodes.user.alreadyExists))
			} else {
				log.debug(user)
				user.password = await cryptPassword(user.password)
				user.userId = uuid()
				await UserModel.create(user)
				return res.json({ userId: user.userId, email: user.email })
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_USER_CREATED, errorCodes.user.create, error))
		}
	}
	
	@Post(PATH.auth.login)
	async loginUser (@Body() user: UserValidation, @Res() res: Response) {
		try {
			const person = await UserModel.findOne({ email: user.email })
			log.debug(person)
			if (person) {
				if (await comparePassword(user.password, person.password)) {
					const accessToken = jwt.sign({ email: person.email, userId: person.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION })
					const refreshToken = jwt.sign({ email: person.email, userId: person.userId }, process.env.REFRESH_TOKEN_SECRET)
					await TokenModel.create({ token: refreshToken })
					return res.json({ accessToken, refreshToken })
				} else {
					log.error(MESSAGES.ERROR_UNAUTHORIZED)
					return res.status(403).send(new Error(MESSAGES.ERROR_UNAUTHORIZED, errorCodes.user.errorAuthData))
				}
			} else {
				log.error(MESSAGES.ERROR_USER_NOT_FOUND)
				res.status(403).send(new Error(MESSAGES.ERROR_USER_NOT_FOUND, errorCodes.user.notFound))
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_USER_LOGIN, errorCodes.user.errorAuthData, error))
		}
	}
	
	@Post(PATH.auth.token)
	async refreshToken (@Body() data: TokenValidation, @Res() res: Response) {
		try {
			log.debug(data.getToken())
			const tokenDocument = await TokenModel.findOne({ token: data.getToken() })
			log.info(tokenDocument)
			const token = tokenDocument?.token
			log.debug('token ' + token)
			let accessToken: string | null = null
			let refreshToken: string | null = null
			if (token) {
				jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err: any, data: any) => {
					log.debug('data: ' + JSON.stringify(data))
					if (err) {
						log.error(err)
						return res.status(500).json(new Error(MESSAGES.ERROR_TOKEN_REFRESH, errorCodes.user.errorAuthData, err))
					}
					try {
						log.info(data)
						accessToken = jwt.sign({ email: data.email , userId: data.userId  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION })
						refreshToken = jwt.sign({ email: data.email , userId: data.userId  }, process.env.REFRESH_TOKEN_SECRET)
					} catch (error) {
						log.error(error)
						return res.status(500).json(new Error(MESSAGES.ERROR_TOKEN_REFRESH, errorCodes.user.errorAuthData, error))
					}
				})
				log.info({ accessToken, refreshToken })
				
				await TokenModel.findOneAndDelete({ token })
				await TokenModel.create({ token: refreshToken })
				return res.json({ accessToken, refreshToken })
			} else {
				log.error(MESSAGES.ERROR_UNDEFINED_TOKEN)
				return res.status(403).json(new Error(MESSAGES.ERROR_UNDEFINED_TOKEN, errorCodes.user.errorAuthData))
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_TOKEN_REFRESH, errorCodes.user.errorAuthData, error))
		}
	}
	
	
	@Delete(PATH.auth.token)
	async removeToken (@QueryParam('token') token: string, @Res() res: Response) {
		try {
			await TokenModel.findOneAndDelete({ token })
			return res.send(MESSAGES.SUCCESS_TOKEN_REMOVED)
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_REMOVE_TOKEN, errorCodes.user.removeToken, error))
		}
	}
}

