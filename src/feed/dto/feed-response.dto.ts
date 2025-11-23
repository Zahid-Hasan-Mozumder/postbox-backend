import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PostType,
  PostReactionType,
  CommentReactionType,
  ReplyReactionType,
} from '../../../generated/prisma/enums';

export class UserSummaryDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string;
}

export class FileDto {
  @ApiProperty({
    description: 'File ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'File name',
    example: 'image.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'File path',
    example: '/uploads/posts/image.jpg',
  })
  filePath: string;

  @ApiProperty({
    description: 'File creation date',
    example: '2023-11-23T10:00:00.000Z',
  })
  createdAt: Date;
}

export class ReactionSummaryDto {
  @ApiProperty({
    description: 'Reaction type',
    example: 'LIKE',
  })
  type: string;

  @ApiProperty({
    description: 'Number of reactions of this type',
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'Whether current user has this reaction',
    example: true,
  })
  hasReacted: boolean;

  @ApiProperty({
    description: 'Users who reacted',
    type: [UserSummaryDto],
  })
  users: UserSummaryDto[];
}

export class ReplyDto {
  @ApiProperty({
    description: 'Reply ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Reply content',
    example: 'This is a reply to the comment!',
  })
  content: string;

  @ApiProperty({
    description: 'Reply author',
    type: UserSummaryDto,
  })
  user: UserSummaryDto;

  @ApiProperty({
    description: 'Reply creation date',
    example: '2023-11-23T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Reply reactions summary',
    type: [ReactionSummaryDto],
  })
  reactions: ReactionSummaryDto[];
}

export class CommentDto {
  @ApiProperty({
    description: 'Comment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great post!',
  })
  content: string;

  @ApiProperty({
    description: 'Comment author',
    type: UserSummaryDto,
  })
  user: UserSummaryDto;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2023-11-23T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Comment replies',
    type: [ReplyDto],
  })
  replies: ReplyDto[];

  @ApiProperty({
    description: 'Comment reactions summary',
    type: [ReactionSummaryDto],
  })
  reactions: ReactionSummaryDto[];
}

export class PostDto {
  @ApiProperty({
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is my first post!',
  })
  content: string;

  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.PUBLIC,
  })
  type: PostType;

  @ApiProperty({
    description: 'Post author',
    type: UserSummaryDto,
  })
  user: UserSummaryDto;

  @ApiProperty({
    description: 'Post files/images',
    type: [FileDto],
  })
  files: FileDto[];

  @ApiProperty({
    description: 'Post creation date',
    example: '2023-11-23T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post comments',
    type: [CommentDto],
  })
  comments: CommentDto[];

  @ApiProperty({
    description: 'Post reactions summary',
    type: [ReactionSummaryDto],
  })
  reactions: ReactionSummaryDto[];
}

export class FeedResponseDto {
  @ApiProperty({
    description: 'Array of posts',
    type: [PostDto],
  })
  posts: PostDto[];

  @ApiProperty({
    description: 'Total number of posts',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of posts per page',
    example: 10,
  })
  limit: number;
}
