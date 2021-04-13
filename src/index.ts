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
import {authChecker} from "utils/helpers";
import {PresentationController} from "./controller/presentation-controller";
import {SlideController} from "./controller/slide-controller";
import {ElementsController} from "./controller/elements-controller";
const cors = require('cors')

connect()
const app: Express = createExpressServer({
	authorizationChecker: authChecker,
	cors: true,
	routePrefix: '/api',
	controllers: [UserController, PresentationController, SlideController, ElementsController], // we specify controllers we want to use
});
const port = process.env.PORT;
const httpContext = require('express-http-context')

app.use(cors())
app.use(bodyParser.json())
app.use(httpContext.middleware)

app.listen(port, () => console.log(`Running on port ${port}`));
