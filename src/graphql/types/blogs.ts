import {
  list,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { extendType } from 'nexus'
import {
  createArticleResolver,
  createCommentResolver,
  getArticleBySlugResolver,
  getCommentsByArticleResolver,
  newCommentResolver
} from '../resolvers/blogs';
import { withFilter } from "graphql-subscriptions";
import { CommentCreatedEvent } from '../../events';

/**
 * Blog Comment
 */
export const blogComment = objectType({
  name: 'blogComment',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('message')
    t.nonNull.string('publishedAt')
    t.nonNull.field('article', {
      type: blogArticle,
      description: "Article commented on by its unique slug"
    })
  },
  description: "Blog Comment"
});


const blogArticle = objectType({
  name: "blogArticle",
  definition: t => {
    t.int('id')
    t.nonNull.string("slug");
  },
  description: "Local table of blog articles for comments"
})


export const ArticleCommentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createComment', {
      type: 'blogComment',
      args: {
        message: nonNull(stringArg()),
        articleSlug: nonNull(stringArg()),
      },
      resolve: createCommentResolver
    });
    t.nonNull.field('createArticle', {
      type: 'blogArticle',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: createArticleResolver
    });
  },
})

export const ArticleCommentsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('blogCommentsByArticle', {
      type: list('blogComment'),
      args: {
        articleSlug: nonNull(stringArg())
      },
      resolve: getCommentsByArticleResolver
    });
    t.field('articleBySlug', {
      type: 'blogArticle',
      args: {
        slug: nonNull(stringArg())
      },
      resolve: getArticleBySlugResolver
    })
  },
});

export const Subscription = extendType({
  type: "Subscription",
  definition(t) {
    t.field('newComment', {
      type: 'blogComment',
      subscribe(_root, _args, ctx) {
        return ctx.pubsub.asyncIterator('newComment')
      },
      resolve: newCommentResolver
    });
    t.field('commentAdded', {
      type: 'blogComment',
      args: {
        articleSlug: nonNull(stringArg())
      },
      subscribe: withFilter(
        (_root, _args, ctx) => ctx.pubsub.asyncIterator('commentAdded'),
        (msg: CommentCreatedEvent, variables) => {
          return (
            msg.data.articleSlug === variables.articleSlug
          );
        }),
      resolve: newCommentResolver
    })

  },
});


