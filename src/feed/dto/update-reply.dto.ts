import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReplyDto {
  @ApiPropertyOptional({
    description: 'Updated reply content text',
    example: 'I updated my reply!',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
