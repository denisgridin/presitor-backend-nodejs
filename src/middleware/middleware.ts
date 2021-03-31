import { Request, Response } from "express";
import {log} from "utils/logger";


export function loggingBody (request: Request, response: Response, next?: (err?: any) => any): any {
	const body = request.body
	log.info(request)
	log.info('Request body: ' + JSON.stringify(body))
	next()
}

export function loggingBefore (request: any, response: any, next?: (err?: any) => any): any {
	next();
}

export function loggingAfter (request: any, response: any, next?: (err?: any) => any): any {
	console.log('do something After...');
	next();
}
