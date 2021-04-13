export const MESSAGES = {
	RUN_ON_ENV: 'Running on environment ',
	ERROR_USER_CREATED: 'Unable to create user',
	SUCCESS_USER_CREATED: 'User successfully created',
	ERROR_USER_EXISTS: 'User is already exists',
	ERROR_USER_LOGIN: 'Unable to login',
	ERROR_USER_NOT_FOUND: 'User is not found',
	ERROR_UNAUTHORIZED: 'Unauthorized',
	ERROR_TOKEN_REFRESH: 'Unable to refresh token',
	ERROR_UNDEFINED_TOKEN: 'Undefined token',
	ERROR_REMOVE_TOKEN: 'Unable to remove token',
	SUCCESS_TOKEN_REMOVED: 'Token successfully removed',
	
	
	ERROR_PRESENTATION_CREATE: 'Unable create presentation',
	ERROR_GET_USER_PRESENTATIONS: 'Unable to get user presentations',
	ERROR_GET_SLIDES: 'Unable to get presentation slides',
	ERROR_CREATE_SLIDE: 'Unable to create slide for presentation',
	ERROR_PRESENTATION_NOT_FOUND: 'Presentation not found',
	ERROR_PRESENTATION_ACCESS: 'You have no access to update this presentation. Contact with presentation editor',
	ERROR_GET_SLIDE: 'Unable to get slide',
	ERROR_DELETE_SLIDE: 'Unable to remove slide',
	ERROR_GET_ELEMENTS: 'Unable to get slide elements',
	ERROR_ELEMENT_CREATE: 'Unable to create element',
	ERROR_UNDEFINED_ELEMENT_TYPE: 'Undefined element type',
	ERROR_ELEMENT_UPDATE: 'Unable to update element',
	ERROR_GET_ELEMENT: 'Unable to get element',
	ERROR_UPDATE_ELEMENT: 'Unable to update element',
	ERROR_REMOVE_ELEMENT: 'Unable to remove element',
	
	
	ERROR_QUERY_NOT_SET(field: string) {
		return `Query parameter is not set: ${field}`;
	}
}
