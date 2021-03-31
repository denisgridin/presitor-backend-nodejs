import {Body, Controller, Get, JsonController, Param, Post, Res} from 'routing-controllers';
import 'reflect-metadata';
import {PATH, TOKEN_EXPIRATION} from "utils/constants"
import {UserModel} from "model/user"
import {IUser} from "interface/user"
import {log} from "utils/logger";
import { Response } from 'express'
import {MESSAGES} from "utils/messages";
import {Error} from "utils/Error";
import {comparePassword, cryptPassword, findExistUser} from "utils/helpers";
import {TokenModel} from "model/token";
import {TokenValidation} from "validators/token";
import {UserValidation} from "validators/user";
import uuid from 'uuid-random'
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
				return res.status(400).send(new Error(MESSAGES.ERROR_USER_EXISTS))
			} else {
				log.debug(user)
				user.password = await cryptPassword(user.password)
				user.user_id = uuid()
				await UserModel.create(user)
				return res.json({ user_id: user.user_id, email: user.email })
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_USER_CREATED, error))
		}
	}
	
	@Post(PATH.auth.login)
	async loginUser (@Body() user: UserValidation, @Res() res: Response) {
		try {
			const person: IUser = await UserModel.findOne({ email: user.email })
			log.debug(person)
			if (person) {
				if (await comparePassword(user.password, person.password)) {
					const accessToken = jwt.sign({ email: person.email, user_id: person.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION })
					const refreshToken = jwt.sign({ email: person.email, user_id: person.user_id }, process.env.REFRESH_TOKEN_SECRET)
					await TokenModel.create({ token: refreshToken })
					return res.json({ accessToken, refreshToken })
				} else {
					log.error(MESSAGES.ERROR_UNAUTHORIZED)
					return res.status(403).send(new Error(MESSAGES.ERROR_UNAUTHORIZED))
				}
			} else {
				log.error(MESSAGES.ERROR_USER_NOT_FOUND)
				res.status(403).send(new Error(MESSAGES.ERROR_USER_NOT_FOUND))
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_USER_LOGIN, error))
		}
	}
	
	@Post(PATH.auth.token)
	async refreshToken (@Body() data: TokenValidation, @Res() res) {
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
						return res.status(500).json(new Error(MESSAGES.ERROR_TOKEN_REFRESH, err))
					}
					
					try {
						log.info(data)
						accessToken = jwt.sign({ email: data.email , user_id: data.user_id  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION })
						refreshToken = jwt.sign({ email: data.email , user_id: data.user_id  }, process.env.REFRESH_TOKEN_SECRET)
					} catch (error) {
						log.error(error)
						return res.status(500).json(new Error(MESSAGES.ERROR_TOKEN_REFRESH, error))
					}
				})
				log.info({ accessToken, refreshToken })
				
				await TokenModel.findOneAndDelete({ token })
				await TokenModel.create({ token: refreshToken })
				return res.json({ accessToken, refreshToken })
			} else {
				log.error(MESSAGES.ERROR_UNDEFINED_TOKEN)
				return res.status(403).json(new Error(MESSAGES.ERROR_UNDEFINED_TOKEN))
			}
		} catch (error) {
			log.error(error)
			return res.status(500).json(new Error(MESSAGES.ERROR_TOKEN_REFRESH, error))
		}
	}
}

