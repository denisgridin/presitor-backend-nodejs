export const PATH = {
	auth: {
		login: '/login',
		registration: '/registration',
		token: '/token',
		tokenCheck: '/token'
	},
	presentations: {
		default: '/presentations',
		last: '/presentations/last/:userId',
		exact: '/presentations/:presentationId'
	},
	slides: {
		default: '/presentations/:presentationId/slides'
	},
	elements: {
		default: '/presentations/:presentationId/slides/:slideId/elements',
		exact: '/presentations/:presentationId/slides/:slideId/elements/:elementId'
	}
}

export const FIELDS = {
	PRESENTATION_ID: 'presentationId',
	SLIDE_ID: 'slideId',
	SLIDE: 'slide',
	ELEMENT_TYPE: 'elementType',
	ELEMENT_ID: 'elementId',
	NAME: 'name',
	INSERTION: 'insertion',
	LAYOUT: 'layout',
	FONT: 'font',
	TEXT: 'text'
}

export const TOKEN_EXPIRATION = '60m'
