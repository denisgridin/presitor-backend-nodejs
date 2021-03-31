export class Error {
	message: string
	error?: any
	
	constructor (message: string, error: any = null) {
		this.message = message
		this.error = error
	}
}
