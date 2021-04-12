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
		presentationAccess: 302
	},
	
	slide: {
		slidesGet: 300,
		slideCreate: 301,
		slideGet: 302,
		deleteSlide: 303
	}
}
