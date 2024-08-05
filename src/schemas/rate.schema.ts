import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Rate extends Document {
	@Prop( { required: true } )
	symbolA: string;
	
	@Prop( { required: true } )
	symbolB: string;
	
	@Prop( { required: true } )
	binancePair: string;
	
	@Prop( { required: false } )
	pairAddress: string;
	
	@Prop( { required: true } )
	timestamp: number;
	
	@Prop( { required: true } )
	rate: number;
	
	@Prop( { required: true, default: true } )
	isCorrect: boolean;
}

export const RateSchema = SchemaFactory.createForClass( Rate );
