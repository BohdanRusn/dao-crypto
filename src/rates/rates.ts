import { HydratedDocument } from "mongoose";
import { Rate } from "../schemas/rate.schema";

export interface IRatesService {
	collectAndStoreRates(): Promise<void>,
	
	getRate( symbolA: string, symbolB: string ): Promise<{ rate: any, timestamp: any }>,
	
	getHistoryRates(
		symbolA: string, symbolB: string, fromTimestamp: number, toTimestamp: number,
	): Promise<Array<HydratedDocument<Rate, {}, {}>>>
}
