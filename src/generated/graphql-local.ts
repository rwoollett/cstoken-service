import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  createArticle: BlogArticle;
  createComment: BlogComment;
  createDraft: Post;
  publish: Post;
};


export type MutationCreateArticleArgs = {
  slug: Scalars['String'];
};


export type MutationCreateCommentArgs = {
  articleSlug: Scalars['String'];
  message: Scalars['String'];
};


export type MutationCreateDraftArgs = {
  body: Scalars['String'];
  title: Scalars['String'];
};


export type MutationPublishArgs = {
  draftId: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  body?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  published?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  articleBySlug?: Maybe<BlogArticle>;
  blogCommentsByArticle?: Maybe<Array<Maybe<BlogComment>>>;
  drafts: Array<Maybe<Post>>;
  posts?: Maybe<Array<Maybe<Post>>>;
};


export type QueryArticleBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryBlogCommentsByArticleArgs = {
  articleSlug: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  commentAdded?: Maybe<BlogComment>;
  newComment?: Maybe<BlogComment>;
};


export type SubscriptionCommentAddedArgs = {
  articleSlug: Scalars['String'];
};

/** Local table of blog articles for comments */
export type BlogArticle = {
  __typename?: 'blogArticle';
  id?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
};

/** Blog Comment */
export type BlogComment = {
  __typename?: 'blogComment';
  /** Article commented on by its unique slug */
  article: BlogArticle;
  id: Scalars['Int'];
  message: Scalars['String'];
  publishedAt: Scalars['String'];
};

export type BlogCommentsByArticleQueryVariables = Exact<{
  articleSlug: Scalars['String'];
}>;


export type BlogCommentsByArticleQuery = { __typename?: 'Query', blogCommentsByArticle?: Array<{ __typename?: 'blogComment', id: number, message: string, publishedAt: string } | null> | null };

export type ArticleBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type ArticleBySlugQuery = { __typename?: 'Query', articleBySlug?: { __typename?: 'blogArticle', id?: number | null } | null };

export type CreateCommentMutationVariables = Exact<{
  message: Scalars['String'];
  articleSlug: Scalars['String'];
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'blogComment', message: string, publishedAt: string, id: number, article: { __typename?: 'blogArticle', slug: string } } };

export type CreateArticleMutationVariables = Exact<{
  slug: Scalars['String'];
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: { __typename?: 'blogArticle', slug: string, id?: number | null } };

export type CommentFeedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CommentFeedSubscription = { __typename?: 'Subscription', newComment?: { __typename?: 'blogComment', id: number, message: string, publishedAt: string, article: { __typename?: 'blogArticle', slug: string } } | null };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts?: Array<{ __typename?: 'Post', id?: number | null, body?: string | null, published?: boolean | null, title?: string | null } | null> | null };


export const BlogCommentsByArticleDocument = gql`
    query BlogCommentsByArticle($articleSlug: String!) {
  blogCommentsByArticle(articleSlug: $articleSlug) {
    id
    message
    publishedAt
  }
}
    `;

/**
 * __useBlogCommentsByArticleQuery__
 *
 * To run a query within a React component, call `useBlogCommentsByArticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlogCommentsByArticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlogCommentsByArticleQuery({
 *   variables: {
 *      articleSlug: // value for 'articleSlug'
 *   },
 * });
 */
export function useBlogCommentsByArticleQuery(baseOptions: Apollo.QueryHookOptions<BlogCommentsByArticleQuery, BlogCommentsByArticleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlogCommentsByArticleQuery, BlogCommentsByArticleQueryVariables>(BlogCommentsByArticleDocument, options);
      }
export function useBlogCommentsByArticleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlogCommentsByArticleQuery, BlogCommentsByArticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlogCommentsByArticleQuery, BlogCommentsByArticleQueryVariables>(BlogCommentsByArticleDocument, options);
        }
export type BlogCommentsByArticleQueryHookResult = ReturnType<typeof useBlogCommentsByArticleQuery>;
export type BlogCommentsByArticleLazyQueryHookResult = ReturnType<typeof useBlogCommentsByArticleLazyQuery>;
export type BlogCommentsByArticleQueryResult = Apollo.QueryResult<BlogCommentsByArticleQuery, BlogCommentsByArticleQueryVariables>;
export const ArticleBySlugDocument = gql`
    query ArticleBySlug($slug: String!) {
  articleBySlug(slug: $slug) {
    id
  }
}
    `;

/**
 * __useArticleBySlugQuery__
 *
 * To run a query within a React component, call `useArticleBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useArticleBySlugQuery(baseOptions: Apollo.QueryHookOptions<ArticleBySlugQuery, ArticleBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleBySlugQuery, ArticleBySlugQueryVariables>(ArticleBySlugDocument, options);
      }
export function useArticleBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleBySlugQuery, ArticleBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleBySlugQuery, ArticleBySlugQueryVariables>(ArticleBySlugDocument, options);
        }
export type ArticleBySlugQueryHookResult = ReturnType<typeof useArticleBySlugQuery>;
export type ArticleBySlugLazyQueryHookResult = ReturnType<typeof useArticleBySlugLazyQuery>;
export type ArticleBySlugQueryResult = Apollo.QueryResult<ArticleBySlugQuery, ArticleBySlugQueryVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($message: String!, $articleSlug: String!) {
  createComment(message: $message, articleSlug: $articleSlug) {
    article {
      slug
    }
    message
    publishedAt
    id
  }
}
    `;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      message: // value for 'message'
 *      articleSlug: // value for 'articleSlug'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateArticleDocument = gql`
    mutation CreateArticle($slug: String!) {
  createArticle(slug: $slug) {
    slug
    id
  }
}
    `;
export type CreateArticleMutationFn = Apollo.MutationFunction<CreateArticleMutation, CreateArticleMutationVariables>;

/**
 * __useCreateArticleMutation__
 *
 * To run a mutation, you first call `useCreateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createArticleMutation, { data, loading, error }] = useCreateArticleMutation({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCreateArticleMutation(baseOptions?: Apollo.MutationHookOptions<CreateArticleMutation, CreateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument, options);
      }
export type CreateArticleMutationHookResult = ReturnType<typeof useCreateArticleMutation>;
export type CreateArticleMutationResult = Apollo.MutationResult<CreateArticleMutation>;
export type CreateArticleMutationOptions = Apollo.BaseMutationOptions<CreateArticleMutation, CreateArticleMutationVariables>;
export const CommentFeedDocument = gql`
    subscription CommentFeed {
  newComment {
    id
    message
    publishedAt
    article {
      slug
    }
  }
}
    `;

/**
 * __useCommentFeedSubscription__
 *
 * To run a query within a React component, call `useCommentFeedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCommentFeedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentFeedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCommentFeedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CommentFeedSubscription, CommentFeedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CommentFeedSubscription, CommentFeedSubscriptionVariables>(CommentFeedDocument, options);
      }
export type CommentFeedSubscriptionHookResult = ReturnType<typeof useCommentFeedSubscription>;
export type CommentFeedSubscriptionResult = Apollo.SubscriptionResult<CommentFeedSubscription>;
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    body
    published
    title
  }
}
    `;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePostsQuery(baseOptions?: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;