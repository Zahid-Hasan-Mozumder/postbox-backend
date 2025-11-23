import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '../../../generated/prisma/enums';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post content text',
    example: 'This is my first post!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Post type - PUBLIC or PRIVATE',
    enum: PostType,
    default: PostType.PUBLIC,
    example: PostType.PUBLIC,
  })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType = PostType.PUBLIC;
}
