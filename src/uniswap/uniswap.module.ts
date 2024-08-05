import { Module } from '@nestjs/common';
import { UniswapService } from './uniswap.service';

@Module( {
	providers: [
		{
			provide: 'UNISWAP_SERVICE',
			useClass: UniswapService,
		},
	],
	exports: [
		{
			provide: 'UNISWAP_SERVICE',
			useClass: UniswapService,
		},
	],
} )
export class UniswapModule {
}
