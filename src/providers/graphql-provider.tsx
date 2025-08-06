import type { ChildrenType } from '../types/general.types';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:1337/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const GraphQLProvider = ({ children }: { children: ChildrenType }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;

