import {UserModel} from "model/user";

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
