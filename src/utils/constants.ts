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
		default: '/presentations/:presentationId/slides',
		exact: '/presentations/:presentationId/slides/:slideId',
	},
	elements: {
		default: '/presentations/:presentationId/slides/:slideId/elements',
		exact: '/presentations/:presentationId/slides/:slideId/elements/:elementId',
		file: '/elements/file'
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
	TEXT: 'text',
	STYLE: 'style',
	USER_ID: 'userId'
}

export const TOKEN_EXPIRATION = '60m'
