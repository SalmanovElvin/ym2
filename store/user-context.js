import React, { useEffect } from 'react';
//import { AsyncStorage } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { useMutation } from '@apollo/client';
import { SkypeIndicator } from 'react-native-indicators';

// context
import { useUnionDispatch } from './union-context';

// graph
import { LOGIN_WITH_TOKEN } from '../graph/mutations/users';


//create default value for the user context
const defaultUser = {
  loggedIn: false,
  profile: {
    firstName: 'Guest',
    lastName: '',
  },

  token: undefined,
};

const USER_KEY = '@USER';

//Implement redux style state and dispatch items to efficiently utilize user context
const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

//implement redux style reducer to limit actions by dispatch callers
const userReducer = (state, action) => {
  //switch by action types
  switch (action.type) {
    case 'LOGIN': {
      //  AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      SecureStore.setItemAsync('token', action.payload.token);
      SecureStore.setItemAsync('uid', action.payload.unionID);
      return {
        ...state,
        ...action.payload,
        loggedIn: true,
      };
    }
    case 'LOGOUT': {
      //   AsyncStorage.removeItem(USER_KEY);
      SecureStore.deleteItemAsync('token');
      SecureStore.deleteItemAsync('uid');
      return defaultUser;
    }
    case 'UPDATE': {
      //AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      throw new Error(`Undefined action.type: ${action.type}`);
    }
  }
};

//create user context provider
const UserProvider = ({ children }) => {
  //useReducer to optimize performance and use callbacks
  const [state, dispatch] = React.useReducer(userReducer, defaultUser);
  const [token, setToken] = React.useState();

  // let token;
  const unionDispatch = useUnionDispatch();

  const [loginWithToken, { error, loading }] = useMutation(LOGIN_WITH_TOKEN, {
    onCompleted: (data) => {
      unionDispatch({
        type: 'ASSIGN',
        payload: data.loginWithToken.union,
      });
      dispatch({
        type: 'LOGIN',
        payload: { ...data.loginWithToken.user, token: token },
      });
    },
  });

  useEffect(() => {
    // console.log('inside use effect user context');
    // console.log('error :>> ', error);
    
    const getAsyncToken = async () => {
      let tempToken = await SecureStore.getItemAsync('token');

      setToken(tempToken);
      if (!!tempToken) {
        loginWithToken({ variables: { token: tempToken, device: 'mobile' } });
      }
    };
    getAsyncToken();
  }, []);

  //pass state and dispatch to wrapped child components
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {loading ? (
            <SkypeIndicator color='white' />
        ) : (
          children
        )}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

//custom hook to abstract usercontext value
const useUserState = () => {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within UserProvider');
  }
  return context;
};

//custom hook to abstract user context modification
const useUserDispatch = () => {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    console.log('error!! useUserDispatch must be used within UserProvider');
    throw new Error('useUserDispatch must be used within UserProvider');
  }
  return context;
};

export { UserProvider, useUserState, useUserDispatch };
