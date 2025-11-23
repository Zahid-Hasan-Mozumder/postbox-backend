import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { UpdateReplyDto } from '../dto/update-reply.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    // Verify post exists and user can comment on it
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.prisma.comment.create({
      data: {
        userId,
        postId: createCommentDto.postId,
        content: createCommentDto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        commentReactions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return this.formatComment(comment, userId);
  }

  async updateComment(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this comment',
      );
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        commentReactions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return this.formatComment(updatedComment, userId);
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }

  async createReply(userId: string, createReplyDto: CreateReplyDto) {
    // Verify comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id: createReplyDto.commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const reply = await this.prisma.reply.create({
      data: {
        userId,
        commentId: createReplyDto.commentId,
        content: createReplyDto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        replyReactions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return this.formatReply(reply, userId);
  }

  async updateReply(
    replyId: string,
    userId: string,
    updateReplyDto: UpdateReplyDto,
  ) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this reply',
      );
    }

    const updatedReply = await this.prisma.reply.update({
      where: { id: replyId },
      data: updateReplyDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        replyReactions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return this.formatReply(updatedReply, userId);
  }

  async deleteReply(replyId: string, userId: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this reply',
      );
    }

    await this.prisma.reply.delete({
      where: { id: replyId },
    });

    return { message: 'Reply deleted successfully' };
  }

  private formatComment(comment: any, userId: string) {
    const commentReactions = comment.commentReactions || [];

    const reactionMap = new Map();
    commentReactions.forEach((reaction) => {
      if (!reactionMap.has(reaction.type)) {
        reactionMap.set(reaction.type, {
          type: reaction.type,
          count: 0,
          hasReacted: false,
          users: [],
        });
      }
      const reactionData = reactionMap.get(reaction.type);
      reactionData.count++;
      reactionData.users.push(reaction.user);
      if (reaction.userId === userId) {
        reactionData.hasReacted = true;
      }
    });

    return {
      id: comment.id,
      content: comment.content,
      user: comment.user,
      createdAt: comment.createdAt,
      reactions: Array.from(reactionMap.values()),
    };
  }

  private formatReply(reply: any, userId: string) {
    const replyReactions = reply.replyReactions || [];

    const reactionMap = new Map();
    replyReactions.forEach((reaction) => {
      if (!reactionMap.has(reaction.type)) {
        reactionMap.set(reaction.type, {
          type: reaction.type,
          count: 0,
          hasReacted: false,
          users: [],
        });
      }
      const reactionData = reactionMap.get(reaction.type);
      reactionData.count++;
      reactionData.users.push(reaction.user);
      if (reaction.userId === userId) {
        reactionData.hasReacted = true;
      }
    });

    return {
      id: reply.id,
      content: reply.content,
      user: reply.user,
      createdAt: reply.createdAt,
      reactions: Array.from(reactionMap.values()),
    };
  }
}
