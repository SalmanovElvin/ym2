import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';

import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const httpLink = createUploadLink({
  // uri: 'http://192.168.2.208:8080/graphql',
  // uri: 'https://service.cluster.younified.io/graphql',
  uri: 'https://service.younified.ca/graphql',
  // uri: 'http://localhost:8080/graphql',
  credentials: 'include',
});

let token = '';
let uid = '';

const getToken = async () => {
  token = await AsyncStorage.getItem('token'); // Use AsyncStorage
  uid = await AsyncStorage.getItem('uid'); // Use AsyncStorage
};

const authLink = setContext((_, { headers }) => {
  getToken();
  return {
    headers: {
      ...headers,
      authorization: token,
      unionID: uid,
    },
  };
});

const gitlEndpoint = new HttpLink({
  //uri: 'http://localhost:8080/gitl',
  uri: 'https://service.younified.ca/gitl',
  fetch,
  headers: {
    'X-Client-Timezone': 'America/Toronto',
    'Accept-Language': 'en',
  },
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === 'gitl',
    gitlEndpoint, //if above
    authLink.concat(httpLink)
  ),
  // link: createUploadLink({ uri: 'http://localhost:8080/graphql' })
});