export const PATH = {
	auth: {
		login: '/login',
		registration: '/registration',
		token: '/token',
		tokenCheck: '/token'
	},
	presentations: {
		default: '/presentations',
		last: '/presentations/last'
	},
	slides: {
		default: '/presentation/:presentationId/slides'
	},
	elements: {
		default: '/presentation/:presentationId/slides/:slideId/elements',
		exact: '/presentation/:presentationId/slides/:slideId/elements/:elementId'
	}
}

export const FIELDS = {
	PRESENTATION_ID: 'presentationId',
	SLIDE_ID: 'slideId',
	SLIDE: 'slide',
	ELEMENT_TYPE: 'elementType',
	ELEMENT_ID: 'elementId'
}

export const TOKEN_EXPIRATION = '60m'
