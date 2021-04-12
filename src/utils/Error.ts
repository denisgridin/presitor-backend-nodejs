export class Error {
	message: string
	code: number
	error?: any
	
	constructor (message: string, code: number, error: any = null) {
		this.message = message
		this.code = code
		this.error = error
	}
}
