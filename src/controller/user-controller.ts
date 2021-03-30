import {Controller, Get, Param, UseAfter, UseBefore} from 'routing-controllers';
import 'reflect-metadata';
import {loggingAfter, loggingBefore} from "../middleware/middleware";

@Controller()
export class UserController {
	@Get('/users/:id')
	getOne (@Param('id') id: number) {
		return 'This action returns user #' + id;
	}
}

