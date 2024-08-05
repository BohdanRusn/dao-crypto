export interface IBinanceService {
	getRate( symbolA: string, symbolB: string ): Promise<number>;
}
