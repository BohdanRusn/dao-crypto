import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { RatesService } from "./rates.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentRateResponseDto, HistoricalRateResponseDto } from "./dto/rate-response.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags( 'rate' )
@Controller( 'rate' )
export class RatesController {
	constructor( private readonly rateService: RatesService ) {
	}
	
	@UseInterceptors( CacheInterceptor )
	@Get( 'getRate' )
	@ApiOperation( { summary: 'Get current rate for a pair of symbols' } )
	@ApiQuery( { name: 'symbolA', required: true, description: 'First symbol of the pair' } )
	@ApiQuery( { name: 'symbolB', required: true, description: 'Second symbol of the pair' } )
	@ApiResponse( { status: 200, description: 'Returns the current rate', type: CurrentRateResponseDto } )
	async getRate(
		@Query( 'symbolA' ) symbolA: string,
		@Query( 'symbolB' ) symbolB: string,
	) {
		return await this.rateService.getRate( symbolA, symbolB );
	}
	
	@Get( 'getHistoryRates' )
	@ApiOperation( { summary: 'Get historical rates for a pair of symbols' } )
	@ApiQuery( { name: 'symbolA', required: true, description: 'First symbol of the pair' } )
	@ApiQuery( { name: 'symbolB', required: true, description: 'Second symbol of the pair' } )
	@ApiQuery( { name: 'fromTimestamp', required: true, description: 'Start timestamp for historical data' } )
	@ApiQuery( { name: 'toTimestamp', required: true, description: 'End timestamp for historical data' } )
	@ApiResponse( { status: 200, description: 'Returns the historical rates', type: [ HistoricalRateResponseDto ] } )
	async getHistoryRates(
		@Query( 'symbolA' ) symbolA: string,
		@Query( 'symbolB' ) symbolB: string,
		@Query( 'fromTimestamp' ) fromTimestamp: number,
		@Query( 'toTimestamp' ) toTimestamp: number,
	) {
		return this.rateService.getHistoryRates( symbolA, symbolB, fromTimestamp, toTimestamp );
	}
	
	@Get( "forceUpdate" )
	@ApiOperation( { summary: 'Update historical rates for a pair of symbols' } )
	async collectAndStoreRates() {
		this.rateService.collectAndStoreRates();
	}
}
