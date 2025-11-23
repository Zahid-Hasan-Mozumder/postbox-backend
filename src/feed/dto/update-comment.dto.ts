import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Updated comment content text',
    example: 'This is an updated comment!',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
