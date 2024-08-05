import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, map } from "rxjs";
import { IBinanceService } from "./binance";

@Injectable()
export class BinanceService implements IBinanceService {
	constructor( private httpService: HttpService ) {
	}
	
	async getRate( symbolA: string, symbolB: string ): Promise<number> {
		try {
			return await this.fetchRate( symbolA, symbolB );
		} catch ( error ) {
			console.log( `Direct pair ${ symbolA }${ symbolB } not found, trying reverse...` );
			try {
				const reversedRate = await this.fetchRate( symbolB, symbolA );
				return 1 / reversedRate;
			} catch ( reversedError ) {
				console.error( `Neither ${ symbolA }${ symbolB } nor ${ symbolB }${ symbolA } found on Binance.` );
				throw new Error( `Unable to fetch rate for ${ symbolA }/${ symbolB } or ${ symbolB }/${ symbolA }` );
			}
		}
	}
	
	private async fetchRate( symbolA: string, symbolB: string ): Promise<number> {
		const pair = `${ symbolA }${ symbolB }`;
		const response = await firstValueFrom(
			this.httpService.get( `https://api.binance.com/api/v3/ticker/price?symbol=${ pair }` )
				.pipe( map( response => response.data ) ),
		);
		return response.price;
	}
}
