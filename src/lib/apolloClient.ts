import { ApolloClient, InMemoryCache, NormalizedCacheObject} from '@apollo/client'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { SchemaLink } from "@apollo/client/link/schema";

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

type SchemaContext =
  SchemaLink.ResolverContext |
  SchemaLink.ResolverContextFunction |
  undefined;

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createSchemaLink(ctx: SchemaContext | undefined) {
  const { schema } = require('../graphql/schema');
  return new SchemaLink({
    schema,
    context: ctx
  });
}

function createApolloClient(ctx?: SchemaContext) {
  return new ApolloClient({
    ssrMode: true,//typeof window === 'undefined',
    link: createSchemaLink(ctx || undefined),
    cache: new InMemoryCache(),
  })
}

interface InitApollo {
  initialState?: any;
  ctx?: SchemaContext;
}

export function initializeApollo({ ctx, initialState }: InitApollo) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx)
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  return _apolloClient
}
