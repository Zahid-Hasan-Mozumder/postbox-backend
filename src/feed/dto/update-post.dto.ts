import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '../../../generated/prisma/enums';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post content text',
    example: 'Updated post content!',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Post type - PUBLIC or PRIVATE',
    enum: PostType,
    example: PostType.PRIVATE,
  })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;
}
