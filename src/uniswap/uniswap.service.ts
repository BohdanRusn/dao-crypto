import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import axios from 'axios';

const PAIR_ABI = [
	'function token0() view returns (address)',
	'function token1() view returns (address)',
	'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
];

@Injectable()
export class UniswapService {
	private readonly provider: ethers.JsonRpcProvider;
	private factoryContract: ethers.Contract;
	
	constructor() {
		this.provider = new ethers.JsonRpcProvider( 'https://bsc-dataseed.binance.org/' );
		this.factoryContract = new ethers.Contract(
			'0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
			[ 'function getPair(address tokenA, address tokenB) view returns (address pair)' ],
			this.provider,
		);
	}
	
	async getRate( symbolA: string, symbolB: string ): Promise<number> {
		const pairAddress = await this.getPairAddress( symbolA, symbolB );
		if ( pairAddress === ethers.ZeroAddress ) {
			throw new Error( `Pair address not found for ${ symbolA }/${ symbolB }` );
		}
		const pairContract = new ethers.Contract( pairAddress, PAIR_ABI, this.provider );
		const [ reserve0, reserve1 ] = await pairContract.getReserves();
		const token0Address = await pairContract.token0();
		const tokenAAddress = await this.getTokenAddress( symbolA );
		return token0Address.toLowerCase() === tokenAAddress.toLowerCase()
			? Number( reserve1 ) / Number( reserve0 )
			: Number( reserve0 ) / Number( reserve1 );
	}
	
	async getPairAddress( symbolA: string, symbolB: string ): Promise<string> {
		const tokenAAddress = await this.getTokenAddress( symbolA );
		const tokenBAddress = await this.getTokenAddress( symbolB );
		return this.factoryContract.getPair( tokenAAddress, tokenBAddress );
	}
	
	// async getTokenAddress( symbol: string ): Promise<string> {
	// 	const response = await axios.get( 'https://api.coingecko.com/api/v3/coins/list' );
	// 	const tokens = response.data;
	// 	const token = tokens.find( ( t: any ) => t.symbol.toLowerCase() === symbol.toLowerCase() );
	// 	if ( !token ) {
	// 		throw new Error( `Token address for ${ symbol } not found` );
	// 	}
	// 	const tokenDetailResponse = await axios.get( `https://api.coingecko.com/api/v3/coins/${ token.id }` );
	//
	// 	return tokenDetailResponse.data.platforms.ethereum || "";
	// }
	async getTokenAddress( symbol: string ): Promise<string> {
		const response = await axios.get( 'https://tokens.pancakeswap.finance/pancakeswap-extended.json' );
		const token = response.data.tokens.find( ( t: any ) => t.symbol.toLowerCase() === symbol.toLowerCase() );
		if ( !token ) {
			throw new Error( `Token address for ${ symbol } not found` );
		}
		
		return token.address || "";
	}
}
