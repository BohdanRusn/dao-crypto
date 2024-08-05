import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rate } from '../schemas/rate.schema';
import { Model } from 'mongoose';
import { IBinanceService } from "../binance/binance";
import { IWhitelist } from "../whitelist/whitelist";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { IUniswapService } from "../uniswap/uniswap";

@Injectable()
export class RatesService {
	private readonly defaultUniswapRate = 0;
	private readonly defaultPairAddress = '';
	
	constructor(
		@InjectModel( Rate.name )
		private rateModel: Model<Rate>,
		@Inject( "BINANCE_SERVICE" )
		private readonly binanceService: IBinanceService,
		@Inject( "WHITELIST_SERVICE" )
		private readonly whitelistService: IWhitelist,
		@Inject( "UNISWAP_SERVICE" )
		private readonly uniswapService: IUniswapService,
		@Inject( CACHE_MANAGER ) private cacheManager: Cache,
	) {
	}
	
	@Cron( '0 * * * * *' )
	async collectAndStoreRates() {
		const pairs = await this.whitelistService.getWhitelistedPairs();
		for ( const pair of pairs ) {
			try {
				const binanceRate = await this.binanceService.getRate( pair.symbolA, pair.symbolB );
				
				let uniswapRate = this.defaultUniswapRate;
				let pairAddress = this.defaultPairAddress;
				
				try {
					uniswapRate = await this.uniswapService.getRate( pair.symbolA, pair.symbolB );
					pairAddress = await this.uniswapService.getPairAddress( pair.symbolA, pair.symbolB );
				} catch ( uniswapError ) {
					console.warn( `Uniswap service failed for ${ pair.symbolA }/${ pair.symbolB }:`, uniswapError.message );
				}
				
				const isCorrect = Math.abs( binanceRate - uniswapRate ) / binanceRate <= 0.1;
				
				const rate = new this.rateModel( {
					symbolA: pair.symbolA,
					symbolB: pair.symbolB,
					binancePair: `${ pair.symbolA }${ pair.symbolB }`,
					pairAddress: pairAddress,
					timestamp: Date.now(),
					rate: binanceRate,
					isCorrect: true,
				} );
				
				await rate.save();
				
				if ( isCorrect ) {
					await this.cacheManager.set( `rate:${ pair.symbolA }:${ pair.symbolB }`, JSON.stringify( {
						timestamp: rate.get( "timestamp" ),
						rate: rate.get( "rate" ),
					} ) );
				}
				
			} catch ( error ) {
				console.error( `Error collecting rates for ${ pair.symbolA }/${ pair.symbolB }:`, error.message );
			}
		}
	}
	
	async getRate( symbolA: string, symbolB: string ) {
		const latestRate = await this.rateModel
			.findOne( { symbolA, symbolB, isCorrect: true } )
			.sort( { timestamp: -1 } )
			.exec() as Rate;
		return latestRate ? { timestamp: latestRate.timestamp, rate: latestRate.rate } : null;
	}
	
	
	async getHistoryRates( symbolA: string, symbolB: string, fromTimestamp: number, toTimestamp: number ) {
		return await this.rateModel
			.find( {
				symbolA,
				symbolB,
				isCorrect: true,
				timestamp: { $gte: fromTimestamp, $lte: toTimestamp },
			} )
			.select( 'timestamp rate -_id' )
			.sort( { timestamp: 1 } )
			.exec() as Rate[];
	}
}
