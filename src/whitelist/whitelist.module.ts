import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WhitelistService } from './whitelist.service';
import { Whitelist, WhitelistSchema } from '../schemas/whitelist.schema';
import { Rate, RateSchema } from "../schemas/rate.schema";
import { WhitelistController } from "./whitelist.controller";

@Module( {
	imports: [
		MongooseModule.forFeature(
			[
				{ name: Whitelist.name, schema: WhitelistSchema },
				{ name: Rate.name, schema: RateSchema },
			],
		),
	],
	controllers: [ WhitelistController ],
	providers: [ {
		provide: "WHITELIST_SERVICE",
		useClass: WhitelistService,
	} ],
	exports: [ {
		provide: "WHITELIST_SERVICE",
		useClass: WhitelistService,
	} ],
} )
export class WhitelistModule {
}
