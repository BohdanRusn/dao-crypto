import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { BinanceModule } from "../binance/binance.module";
import { WhitelistModule } from "../whitelist/whitelist.module";
import { UniswapModule } from "../uniswap/uniswap.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Rate, RateSchema } from "../schemas/rate.schema";
import { ScheduleModule } from "@nestjs/schedule";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";

@Module( {
	imports: [
		ScheduleModule.forRoot(),
		CacheModule.registerAsync( {
			imports: [ ConfigModule ],
			useFactory: async ( configService: ConfigService ) => {
				const redisHost = configService.get<string>( 'redis.host' );
				const redisPort = configService.get<number>( 'redis.port' );
				const redisUrl = `redis://${ redisHost }:${ redisPort }`;
				return {
					ttl: 60 * 1000,
					store: await redisStore( {
						url: redisUrl,
					} ),
				};
			},
			inject: [ ConfigService ],
		} ),
		MongooseModule.forFeature( [ { name: Rate.name, schema: RateSchema } ] ),
		BinanceModule,
		WhitelistModule,
		UniswapModule,
	],
	controllers: [ RatesController ],
	providers: [ RatesService ],
} )
export class RatesModule {
}
