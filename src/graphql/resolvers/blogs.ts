import { FieldResolver } from "nexus";
import { CommentCreatedEvent, Subjects } from "../../events";

export const getCommentsByArticleResolver: FieldResolver<
  "Query",
  "blogCommentsByArticle"
> = async (_, { articleSlug }, { prisma }) => {
  const comments = await prisma.blogComment
    .findMany({
      where: {
        article: {
          slug: articleSlug
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        article: true, // Return all fields
      },

    });
  return [...comments].map((comment) => (
    { ...comment, publishedAt: comment.publishedAt.toISOString() }
  ));
};

export const getArticleBySlugResolver: FieldResolver<
  "Query",
  "articleBySlug"
> = async (_, { slug }, { prisma }) => {
  return await prisma.blogArticle.findUnique({ where: { slug } });
};

export const createCommentResolver: FieldResolver<
  "Mutation", "createComment"
> = async (_, { message, articleSlug }, { prisma, pubsub }) => {
  const newComment = await prisma.blogComment.create({
    data: {
      message,
      articleSlug
    }
  });
  pubsub && pubsub.publish('newComment', {
    subject: Subjects.CommentCreated,
    data: { ...newComment,
      publishedAt: newComment.publishedAt.toISOString()
    }
  } as CommentCreatedEvent
  );

  pubsub && pubsub.publish('commentAdded',
    {
      subject: Subjects.CommentCreated,
      data: { ...newComment,
        publishedAt: newComment.publishedAt.toISOString()
      }
    } as CommentCreatedEvent);

  return {
    id: newComment.id,
    message: newComment.message,
    publishedAt: newComment.publishedAt.toISOString(),
    article: {
      slug: articleSlug
    }
  }
};

export const createArticleResolver: FieldResolver<
  "Mutation", "createArticle"
> = async (_, { slug }, { prisma }) => {
  const newArticle = await prisma.blogArticle.create({
    data: {
      slug
    }
  });
  return {
    slug: newArticle.slug,
    id: newArticle.id
  }
};

export const newCommentResolver = (payload: CommentCreatedEvent) => {
  const { data: comment } = payload;
  return {
    id: comment.id,
    message: comment.message,
    publishedAt: comment.publishedAt,
    article: {
      slug: comment.articleSlug
    }
  };
};
