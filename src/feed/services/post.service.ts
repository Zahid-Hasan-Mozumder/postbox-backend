import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostType } from '../../../generated/prisma/enums';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
    files?: Express.Multer.File[],
  ) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        content: createPostDto.content,
        type: createPostDto.type || PostType.PUBLIC,
        files: files
          ? {
              create: files.map((file) => ({
                fileName: file.originalname,
                filePath: file.path,
              })),
            }
          : undefined,
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
        files: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            replies: {
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
        },
        postReactions: {
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

    return this.formatPost(post, userId);
  }

  async getFeed(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Get posts that are either PUBLIC or PRIVATE posts by the current user
    const where = {
      OR: [{ type: PostType.PUBLIC }, { type: PostType.PRIVATE, userId }],
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          files: true,
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              replies: {
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
                orderBy: { createdAt: 'asc' },
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
            orderBy: { createdAt: 'asc' },
          },
          postReactions: {
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map((post) => this.formatPost(post, userId)),
      total,
      page,
      limit,
    };
  }

  async getPostById(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        files: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            replies: {
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
              orderBy: { createdAt: 'asc' },
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
          orderBy: { createdAt: 'asc' },
        },
        postReactions: {
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

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user can view this post
    if (post.type === PostType.PRIVATE && post.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this post',
      );
    }

    return this.formatPost(post, userId);
  }

  async updatePost(
    postId: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this post',
      );
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: updatePostDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        files: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            replies: {
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
        },
        postReactions: {
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

    return this.formatPost(updatedPost, userId);
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post deleted successfully' };
  }

  private formatPost(post: any, userId: string) {
    const postReactions = post.postReactions || [];

    // Group reactions by type
    const reactionMap = new Map();
    postReactions.forEach((reaction) => {
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

    const formattedComments = (post.comments || []).map((comment) => {
      const commentReactions = comment.commentReactions || [];

      const commentReactionMap = new Map();
      commentReactions.forEach((reaction) => {
        if (!commentReactionMap.has(reaction.type)) {
          commentReactionMap.set(reaction.type, {
            type: reaction.type,
            count: 0,
            hasReacted: false,
            users: [],
          });
        }
        const reactionData = commentReactionMap.get(reaction.type);
        reactionData.count++;
        reactionData.users.push(reaction.user);
        if (reaction.userId === userId) {
          reactionData.hasReacted = true;
        }
      });

      const formattedReplies = (comment.replies || []).map((reply) => {
        const replyReactions = reply.replyReactions || [];

        const replyReactionMap = new Map();
        replyReactions.forEach((reaction) => {
          if (!replyReactionMap.has(reaction.type)) {
            replyReactionMap.set(reaction.type, {
              type: reaction.type,
              count: 0,
              hasReacted: false,
              users: [],
            });
          }
          const reactionData = replyReactionMap.get(reaction.type);
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
          reactions: Array.from(replyReactionMap.values()),
        };
      });

      return {
        id: comment.id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt,
        replies: formattedReplies,
        reactions: Array.from(commentReactionMap.values()),
      };
    });

    return {
      id: post.id,
      content: post.content,
      type: post.type,
      user: post.user,
      files: post.files || [],
      createdAt: post.createdAt,
      comments: formattedComments,
      reactions: Array.from(reactionMap.values()),
    };
  }
}
