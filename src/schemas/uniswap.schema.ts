import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Whitelist extends Document {
	@Prop( { required: true } )
	symbolA: string;
	
	@Prop( { required: true } )
	symbolB: string;
}

export const UniswapSchema = SchemaFactory.createForClass( Whitelist );
