import { Controller, Delete, Get, Inject, Post, Query } from '@nestjs/common';
import { Whitelist } from '../schemas/whitelist.schema';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WhitelistDto } from "./dto/whitelist.dto";
import { IWhitelist } from "./whitelist";

@ApiTags( 'whitelist' )
@Controller( 'whitelist' )
export class WhitelistController {
	constructor(
		@Inject( "WHITELIST_SERVICE" )
		private readonly whitelistService: IWhitelist,
	) {
	}
	
	@Get()
	@ApiOperation( { summary: 'Get all whitelisted pairs' } )
	@ApiResponse( { status: 200, description: 'Returns all whitelisted pairs', type: [ WhitelistDto ] } )
	async getWhitelistedPairs(): Promise<Whitelist[]> {
		return this.whitelistService.getWhitelistedPairs();
	}
	
	@Post()
	@ApiOperation( { summary: 'Add a new pair to the whitelist' } )
	@ApiQuery( { name: 'symbolA', required: true, description: 'First symbol of the pair' } )
	@ApiQuery( { name: 'symbolB', required: true, description: 'Second symbol of the pair' } )
	@ApiResponse( { status: 201, description: 'The pair has been successfully added', type: WhitelistDto } )
	async addPair(
		@Query( 'symbolA' ) symbolA: string,
		@Query( 'symbolB' ) symbolB: string,
	): Promise<Whitelist> {
		return this.whitelistService.addPair( symbolA, symbolB );
	}
	
	@Delete()
	@ApiOperation( { summary: 'Remove a pair from the whitelist' } )
	@ApiQuery( { name: 'symbolA', required: true, description: 'First symbol of the pair' } )
	@ApiQuery( { name: 'symbolB', required: true, description: 'Second symbol of the pair' } )
	@ApiResponse( { status: 200, description: 'The pair has been successfully removed' } )
	async removePair(
		@Query( 'symbolA' ) symbolA: string,
		@Query( 'symbolB' ) symbolB: string,
	): Promise<any> {
		return this.whitelistService.removePair( symbolA, symbolB );
	}
}
