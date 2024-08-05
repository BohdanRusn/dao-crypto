export interface IUniswapService {
	getPairAddress( symbolA: string, symbolB: string ): Promise<string>,
	
	getRate( symbolA: string, symbolB: string ): Promise<number>,
	
	getTokenAddress( symbol: string ): Promise<string>
}
