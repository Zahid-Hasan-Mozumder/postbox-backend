import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePostReactionDto,
  CreateCommentReactionDto,
  CreateReplyReactionDto,
} from '../dto/create-reaction.dto';
import {
  PostReactionType,
  CommentReactionType,
  ReplyReactionType,
} from '../../../generated/prisma/enums';

@Injectable()
export class ReactionService {
  constructor(private prisma: PrismaService) {}

  async togglePostReaction(
    userId: string,
    createPostReactionDto: CreatePostReactionDto,
  ) {
    const { postId, type } = createPostReactionDto;

    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if reaction already exists
    const existingReaction = await this.prisma.postReaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Same reaction type - remove it
        await this.prisma.postReaction.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
        return { message: 'Reaction removed', action: 'removed' };
      } else {
        // Different reaction type - update it
        await this.prisma.postReaction.update({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
          data: { type },
        });
        return { message: 'Reaction updated', action: 'updated' };
      }
    } else {
      // Create new reaction
      await this.prisma.postReaction.create({
        data: {
          postId,
          userId,
          type,
        },
      });
      return { message: 'Reaction added', action: 'added' };
    }
  }

  async toggleCommentReaction(
    userId: string,
    createCommentReactionDto: CreateCommentReactionDto,
  ) {
    const { commentId, type } = createCommentReactionDto;

    // Verify comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if reaction already exists
    const existingReaction = await this.prisma.commentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Same reaction type - remove it
        await this.prisma.commentReaction.delete({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
        });
        return { message: 'Reaction removed', action: 'removed' };
      } else {
        // Different reaction type - update it
        await this.prisma.commentReaction.update({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
          data: { type },
        });
        return { message: 'Reaction updated', action: 'updated' };
      }
    } else {
      // Create new reaction
      await this.prisma.commentReaction.create({
        data: {
          commentId,
          userId,
          type,
        },
      });
      return { message: 'Reaction added', action: 'added' };
    }
  }

  async toggleReplyReaction(
    userId: string,
    createReplyReactionDto: CreateReplyReactionDto,
  ) {
    const { replyId, type } = createReplyReactionDto;

    // Verify reply exists
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    // Check if reaction already exists
    const existingReaction = await this.prisma.replyReaction.findUnique({
      where: {
        replyId_userId: {
          replyId,
          userId,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Same reaction type - remove it
        await this.prisma.replyReaction.delete({
          where: {
            replyId_userId: {
              replyId,
              userId,
            },
          },
        });
        return { message: 'Reaction removed', action: 'removed' };
      } else {
        // Different reaction type - update it
        await this.prisma.replyReaction.update({
          where: {
            replyId_userId: {
              replyId,
              userId,
            },
          },
          data: { type },
        });
        return { message: 'Reaction updated', action: 'updated' };
      }
    } else {
      // Create new reaction
      await this.prisma.replyReaction.create({
        data: {
          replyId,
          userId,
          type,
        },
      });
      return { message: 'Reaction added', action: 'added' };
    }
  }

  async getPostReactions(postId: string) {
    const reactions = await this.prisma.postReaction.findMany({
      where: { postId },
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
    });

    return this.groupReactions(reactions);
  }

  async getCommentReactions(commentId: string) {
    const reactions = await this.prisma.commentReaction.findMany({
      where: { commentId },
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
    });

    return this.groupReactions(reactions);
  }

  async getReplyReactions(replyId: string) {
    const reactions = await this.prisma.replyReaction.findMany({
      where: { replyId },
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
    });

    return this.groupReactions(reactions);
  }

  private groupReactions(reactions: any[]) {
    const reactionMap = new Map();

    reactions.forEach((reaction) => {
      if (!reactionMap.has(reaction.type)) {
        reactionMap.set(reaction.type, {
          type: reaction.type,
          count: 0,
          users: [],
        });
      }
      const reactionData = reactionMap.get(reaction.type);
      reactionData.count++;
      reactionData.users.push(reaction.user);
    });

    return Array.from(reactionMap.values());
  }
}
