import { ApiProperty } from '@nestjs/swagger';

export class WhitelistDto {
	@ApiProperty( { description: 'First symbol of the pair' } )
	symbolA: string;
	
	@ApiProperty( { description: 'Second symbol of the pair' } )
	symbolB: string;
}
