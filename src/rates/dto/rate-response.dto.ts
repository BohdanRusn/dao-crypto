import { ApiProperty } from '@nestjs/swagger';

export class CurrentRateResponseDto {
	@ApiProperty( { description: 'Timestamp of the rate' } )
	timestamp: number;
	
	@ApiProperty( { description: 'Exchange rate' } )
	rate: number;
}

export class HistoricalRateResponseDto {
	@ApiProperty( { description: 'Timestamp of the rate' } )
	timestamp: number;
	
	@ApiProperty( { description: 'Exchange rate' } )
	rate: number;
}
