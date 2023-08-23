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

/** A client ip takes ownership of CS token from the sourceIp */
export type AcquireCs = {
  __typename?: 'AcquireCS';
  acquiredAt: Scalars['String'];
  id: Scalars['Int'];
  ip: Scalars['String'];
  sourceIp: Scalars['String'];
};

/** Clients to request and acquire the single token for CS */
export type Client = {
  __typename?: 'Client';
  connected: Scalars['Boolean'];
  id: Scalars['Int'];
  ip: Scalars['String'];
  name: Scalars['String'];
  /** The client ip associated request parent record(always the same two record using ip) */
  requestParent: RequestParent;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAcquireCS: AcquireCs;
  createClient: Client;
  createRequestCS: RequestCs;
};


export type MutationCreateAcquireCsArgs = {
  ip: Scalars['String'];
  sourceIp: Scalars['String'];
};


export type MutationCreateClientArgs = {
  connected: Scalars['Boolean'];
  ip: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreateRequestCsArgs = {
  parentIp: Scalars['String'];
  relayed: Scalars['Boolean'];
  sourceIp: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getClients: Array<Maybe<Client>>;
};

/** A request for CS from a client source ip to its currently known parent ip in the distributed tree */
export type RequestCs = {
  __typename?: 'RequestCS';
  id: Scalars['Int'];
  parentIp: Scalars['String'];
  relayed: Scalars['Boolean'];
  requestedAt: Scalars['String'];
  sourceIp: Scalars['String'];
};

/** Clients to request and acquire the single token for CS */
export type RequestParent = {
  __typename?: 'RequestParent';
  clientIp: Scalars['String'];
  id: Scalars['Int'];
};

export type CreateRequestCsMutationVariables = Exact<{
  sourceIp: Scalars['String'];
  parentIp: Scalars['String'];
  relayed: Scalars['Boolean'];
}>;


export type CreateRequestCsMutation = { __typename?: 'Mutation', createRequestCS: { __typename?: 'RequestCS', id: number, relayed: boolean, requestedAt: string, sourceIp: string, parentIp: string } };

export type GetClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsQuery = { __typename?: 'Query', getClients: Array<{ __typename?: 'Client', ip: string, name: string } | null> };


export const CreateRequestCsDocument = gql`
    mutation CreateRequestCS($sourceIp: String!, $parentIp: String!, $relayed: Boolean!) {
  createRequestCS(sourceIp: $sourceIp, parentIp: $parentIp, relayed: $relayed) {
    id
    relayed
    requestedAt
    sourceIp
    parentIp
  }
}
    `;
export type CreateRequestCsMutationFn = Apollo.MutationFunction<CreateRequestCsMutation, CreateRequestCsMutationVariables>;

/**
 * __useCreateRequestCsMutation__
 *
 * To run a mutation, you first call `useCreateRequestCsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRequestCsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRequestCsMutation, { data, loading, error }] = useCreateRequestCsMutation({
 *   variables: {
 *      sourceIp: // value for 'sourceIp'
 *      parentIp: // value for 'parentIp'
 *      relayed: // value for 'relayed'
 *   },
 * });
 */
export function useCreateRequestCsMutation(baseOptions?: Apollo.MutationHookOptions<CreateRequestCsMutation, CreateRequestCsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRequestCsMutation, CreateRequestCsMutationVariables>(CreateRequestCsDocument, options);
      }
export type CreateRequestCsMutationHookResult = ReturnType<typeof useCreateRequestCsMutation>;
export type CreateRequestCsMutationResult = Apollo.MutationResult<CreateRequestCsMutation>;
export type CreateRequestCsMutationOptions = Apollo.BaseMutationOptions<CreateRequestCsMutation, CreateRequestCsMutationVariables>;
export const GetClientsDocument = gql`
    query GetClients {
  getClients {
    ip
    name
  }
}
    `;

/**
 * __useGetClientsQuery__
 *
 * To run a query within a React component, call `useGetClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClientsQuery(baseOptions?: Apollo.QueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
      }
export function useGetClientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
        }
export type GetClientsQueryHookResult = ReturnType<typeof useGetClientsQuery>;
export type GetClientsLazyQueryHookResult = ReturnType<typeof useGetClientsLazyQuery>;
export type GetClientsQueryResult = Apollo.QueryResult<GetClientsQuery, GetClientsQueryVariables>;