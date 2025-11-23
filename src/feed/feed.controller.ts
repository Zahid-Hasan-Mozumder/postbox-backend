import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';
import { ReactionService } from './services/reaction.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import {
  CreatePostReactionDto,
  CreateCommentReactionDto,
  CreateReplyReactionDto,
} from './dto/create-reaction.dto';
import { FeedResponseDto, PostDto } from './dto/feed-response.dto';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private reactionService: ReactionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get feed posts' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Posts per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Feed retrieved successfully',
    type: FeedResponseDto,
  })
  async getFeed(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<FeedResponseDto> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.postService.getFeed(req.user.id, pageNum, limitNum);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot view private post',
  })
  async getPost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Request() req,
  ): Promise<PostDto> {
    return this.postService.getPostById(postId, req.user.id);
  }

  @Post('posts')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post data',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<PostDto> {
    return this.postService.createPost(req.user.id, createPostDto, files);
  }

  @Put('posts/:id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot update others posts',
  })
  async updatePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Request() req,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDto> {
    return this.postService.updatePost(postId, req.user.id, updatePostDto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot delete others posts',
  })
  async deletePost(@Param('id', ParseUUIDPipe) postId: string, @Request() req) {
    return this.postService.deletePost(postId, req.user.id);
  }

  @Post('posts/:id/comments')
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async createComment(
    @Param('id', ParseUUIDPipe) postId: string,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(req.user.id, {
      ...createCommentDto,
      postId,
    });
  }

  @Put('comments/:id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot update others comments',
  })
  async updateComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      commentId,
      req.user.id,
      updateCommentDto,
    );
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot delete others comments',
  })
  async deleteComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Request() req,
  ) {
    return this.commentService.deleteComment(commentId, req.user.id);
  }

  @Post('comments/:id/replies')
  @ApiOperation({ summary: 'Create a reply to a comment' })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Reply created successfully',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async createReply(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Request() req,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.commentService.createReply(req.user.id, {
      ...createReplyDto,
      commentId,
    });
  }

  @Put('replies/:id')
  @ApiOperation({ summary: 'Update a reply' })
  @ApiParam({
    name: 'id',
    description: 'Reply ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reply updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot update others replies',
  })
  async updateReply(
    @Param('id', ParseUUIDPipe) replyId: string,
    @Request() req,
    @Body() updateReplyDto: UpdateReplyDto,
  ) {
    return this.commentService.updateReply(
      replyId,
      req.user.id,
      updateReplyDto,
    );
  }

  @Delete('replies/:id')
  @ApiOperation({ summary: 'Delete a reply' })
  @ApiParam({
    name: 'id',
    description: 'Reply ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Reply deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot delete others replies',
  })
  async deleteReply(
    @Param('id', ParseUUIDPipe) replyId: string,
    @Request() req,
  ) {
    return this.commentService.deleteReply(replyId, req.user.id);
  }

  @Post('posts/:id/reactions')
  @ApiOperation({ summary: 'Toggle reaction on a post (like/unlike)' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reaction toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async togglePostReaction(
    @Param('id', ParseUUIDPipe) postId: string,
    @Request() req,
    @Body() createPostReactionDto: CreatePostReactionDto,
  ) {
    return this.reactionService.togglePostReaction(req.user.id, {
      ...createPostReactionDto,
      postId,
    });
  }

  @Post('comments/:id/reactions')
  @ApiOperation({ summary: 'Toggle reaction on a comment (like/unlike)' })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reaction toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async toggleCommentReaction(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Request() req,
    @Body() createCommentReactionDto: CreateCommentReactionDto,
  ) {
    return this.reactionService.toggleCommentReaction(req.user.id, {
      ...createCommentReactionDto,
      commentId,
    });
  }

  @Post('replies/:id/reactions')
  @ApiOperation({ summary: 'Toggle reaction on a reply (like/unlike)' })
  @ApiParam({
    name: 'id',
    description: 'Reply ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reaction toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  async toggleReplyReaction(
    @Param('id', ParseUUIDPipe) replyId: string,
    @Request() req,
    @Body() createReplyReactionDto: CreateReplyReactionDto,
  ) {
    return this.reactionService.toggleReplyReaction(req.user.id, {
      ...createReplyReactionDto,
      replyId,
    });
  }
}
