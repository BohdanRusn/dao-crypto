import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Whitelist } from '../schemas/whitelist.schema';
import { IWhitelist } from "./whitelist";
import { Rate } from "../schemas/rate.schema";

@Injectable()
export class WhitelistService implements IWhitelist {
	constructor(
		@InjectModel( Whitelist.name )
		private whitelistModel: Model<Whitelist>,
		@InjectModel( 'Rate' )
		private ratesModel: Model<Rate>,
	) {
	}
	
	async getWhitelistedPairs(): Promise<Whitelist[]> {
		return this.whitelistModel.find( {}, { symbolA: 1, symbolB: 1, _id: 0 } ).exec();
	}
	
	async addPair( symbolA: string, symbolB: string ): Promise<Whitelist> {
		const newPair = new this.whitelistModel( { symbolA, symbolB } );
		return newPair.save();
	}
	
	async removePair( symbolA: string, symbolB: string ): Promise<any> {
		await this.ratesModel.deleteMany( { symbolA, symbolB } ).exec();
		
		return this.whitelistModel.deleteOne( { symbolA, symbolB } ).exec();
	}
}
