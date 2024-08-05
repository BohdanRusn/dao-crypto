import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { HttpModule } from "@nestjs/axios";

@Module( {
	imports: [ HttpModule ],
	providers: [ {
		useClass: BinanceService,
		provide: "BINANCE_SERVICE",
	} ],
	exports: [ {
		useClass: BinanceService,
		provide: "BINANCE_SERVICE",
	} ],
} )
export class BinanceModule {
}
