import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
  throw new Error(
    'NEXT_PUBLIC_GRAPHQL_ENDPOINT environment variable not defined'
  )
}

const theGraphLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: theGraphLink,
})

export default client
