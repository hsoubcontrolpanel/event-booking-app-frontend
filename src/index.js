import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/css/bootstrap.rtl.min.css"
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities" 

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://glacial-journey-88847.herokuapp.com/graphql',
  connectionParams: {
    authToken: localStorage.getItem('token'),
  },
}));

const httpLink = createHttpLink({
  uri: 'https://glacial-journey-88847.herokuapp.com/graphql',
  credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query) 
    return (definition.kind === 'OperationDefinition' && definition.operation === 'subscription') 
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)


