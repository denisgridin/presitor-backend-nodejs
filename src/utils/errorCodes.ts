export const errorCodes = {
	user: {
		errorAuthData: 100,
		alreadyExists: 101,
		notFound: 102,
		create: 103,
		login: 104,
		removeToken: 105
	},
	
	presentation: {
		userPresentationCreate: 200,
		userPresentationGet: 201,
		notFound: 202,
		presentationAccess: 302,
		presentationRemove: 303,
		presentationUpdate: 304
	},
	
	slide: {
		slidesGet: 300,
		slideCreate: 301,
		slideGet: 302,
		deleteSlide: 303
	},
	
	element: {
		elementsGet: 400,
		elementCreate: 401,
		elementTypeUndefined: 402,
		elementUpdate: 403,
		elementGet: 404,
		elementRemove: 405
	}
}
