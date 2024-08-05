import { Module } from '@nestjs/common';
import { RatesModule } from "./rates/rates.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import config from "./config";

@Module( {
	imports: [
		ConfigModule.forRoot( {
			isGlobal: true,
			load: [ config ],
		} ),
		MongooseModule.forRoot( "mongodb+srv://chitatel008:F0sumG92UoBm7UsF@dao.bv7z4fn.mongodb.net/" ),
		RatesModule,
	],
} )
export class AppModule {
}
