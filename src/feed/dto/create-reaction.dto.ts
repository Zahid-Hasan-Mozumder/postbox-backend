import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PostReactionType,
  CommentReactionType,
  ReplyReactionType,
} from '../../../generated/prisma/enums';

export class CreatePostReactionDto {
  @ApiProperty({
    description: 'ID of the post to react to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  postId: string;

  @ApiProperty({
    description: 'Reaction type',
    enum: PostReactionType,
    example: PostReactionType.LIKE,
  })
  @IsNotEmpty()
  @IsEnum(PostReactionType)
  type: PostReactionType;
}

export class CreateCommentReactionDto {
  @ApiProperty({
    description: 'ID of the comment to react to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  commentId: string;

  @ApiProperty({
    description: 'Reaction type',
    enum: CommentReactionType,
    example: CommentReactionType.LIKE,
  })
  @IsNotEmpty()
  @IsEnum(CommentReactionType)
  type: CommentReactionType;
}

export class CreateReplyReactionDto {
  @ApiProperty({
    description: 'ID of the reply to react to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  replyId: string;

  @ApiProperty({
    description: 'Reaction type',
    enum: ReplyReactionType,
    example: ReplyReactionType.LIKE,
  })
  @IsNotEmpty()
  @IsEnum(ReplyReactionType)
  type: ReplyReactionType;
}
