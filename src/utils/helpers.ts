import {UserModel} from "model/user";
import {IUser} from "interface/user";
import {log} from "utils/logger";
import {MESSAGES} from "utils/messages";
import {Error} from "utils/Error";
import {errorCodes} from "utils/errorCodes";
import {TOKEN_EXPIRATION} from "utils/constants";
import {Action} from "routing-controllers";
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

// Шифрование пароля
export async function cryptPassword (password: string) {
	const salt = await bcrypt.genSalt(10)
	return bcrypt.hash(password, salt)
}

// Поиск существующего польлзователя
export async function findExistUser (email: string): Promise<boolean> {
	const users = await UserModel.findOne({ email })
	return users !== null
}

// Сравнивание зашифрованного и передаваемого пароля
export async function comparePassword (password: string, hash: string) {
	return bcrypt.compare(password, hash)
}

// Получение пользователя по параметрам
export async function findUserByCondition (condition: IUser): Promise<IUser> {
	return new Promise<IUser>(async (resolve, reject) => {
		try {
			const user = await UserModel.findOne(condition)
			if (user) {
				delete user.password
				delete user.id
				resolve(user)
			} else {
				log.error(MESSAGES.ERROR_USER_NOT_FOUND)
				reject(MESSAGES.ERROR_USER_NOT_FOUND)
			}
		} catch (error) {
			log.error(error)
			reject(error)
		}
	})
}

export function getUserFromToken (token: string): IUser {
	let user = {} as IUser
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, data: any) => {
		if (err) {
			log.error(err)
			return {} as IUser
		}
		user = data
		log.debug('data: ' + JSON.stringify(data))
		log.info('token valid: ' + !(!!err))
	})
	return user
}

export function authChecker (action: Action): boolean {
	if (action.request.headers['authorization']) {
		const token = action.request.headers['authorization']?.split(' ')[1]
		let result: boolean = false
		log.debug('token: ' + token)
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, data: any) => {
			log.debug('data: ' + JSON.stringify(data))
			log.info('token valid: ' + !(!!err))
			log.error(err)
			result = !(!!err)
		})
		return result
	} else {
		return false
	}
}

export async function asyncForEach (array, callback) {
	for (let i = 0; i < array.length; i++) {
		await callback(array[i], i, array)
	}
}
