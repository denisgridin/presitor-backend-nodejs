import log4js from 'log4js'
const logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL

const dotenv = require('dotenv')
dotenv.config()

import { createExpressServer } from 'routing-controllers'
import { UserController } from './controller/user-controller'
import {Express} from "express"
import {connect} from "utils/database";
import bodyParser from "body-parser";

connect()
const app: Express = createExpressServer({
	cors: true,
	routePrefix: '/api',
	controllers: [UserController], // we specify controllers we want to use
});
const port = process.env.PORT;
const httpContext = require('express-http-context')

app.use(bodyParser.json())
app.use(httpContext.middleware)

app.listen(port, () => console.log(`Running on port ${port}`));
