import log4js from 'log4js'
const logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL

const dotenv = require('dotenv')
dotenv.config()

import { createExpressServer } from 'routing-controllers'
import { UserController } from './controller/user-controller'
import {Express} from "express"

const app: Express = createExpressServer({
	controllers: [UserController], // we specify controllers we want to use
});
const port = process.env.PORT;

app.listen(port, () => console.log(`Running on port ${port}`));
