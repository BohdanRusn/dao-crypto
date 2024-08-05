import { Whitelist } from "../schemas/whitelist.schema";

export interface IWhitelist {
	getWhitelistedPairs(): Promise<Whitelist[]>,
	
	addPair( symbolA: string, symbolB: string ): Promise<Whitelist>,
	
	removePair( symbolA: string, symbolB: string ): Promise<any>
}
