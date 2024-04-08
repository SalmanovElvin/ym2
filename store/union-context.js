import React from 'react';
import { AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';

//Implement redux style state and dispatch items to efficiently utilize union context
const UnionStateContext = React.createContext();
const UnionDispatchContext = React.createContext();

const UNION_KEY = 'UNION';

//implement redux style reducer to limit actions by dispatch callers
const unionReducer = (state, action) => {
  //switch by action types
  switch (action.type) {
    case 'ASSIGN': {
      SecureStore.setItemAsync(UNION_KEY, JSON.stringify(action.payload));
      return { ...state, ...action.payload };
    }
    case 'UPDATE': {
      SecureStore.setItemAsync(UNION_KEY, JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'RESET': {
      SecureStore.setItemAsync(UNION_KEY);
      return {};
    }
    default: {
      throw new Error(`Undefined actiontype: ${action.type}`);
    }
  }
};

//create union context provider
const UnionProvider = ({ children }) => {
  //useReducer to optimize performance and use callbacks
  const [state, dispatch] = React.useReducer(unionReducer, {});

  //pass state and dispatch to wrapped child components
  return (
    <UnionStateContext.Provider value={state}>
      <UnionDispatchContext.Provider value={dispatch}>
        {children}
      </UnionDispatchContext.Provider>
    </UnionStateContext.Provider>
  );
};

//custom hook to expose usercontext value while hiding implementation
const useUnionState = () => {
  const context = React.useContext(UnionStateContext);
  if (context === undefined) {
    throw new Error('useUnionState must be used within UnionProvider');
  }
  return context;
};

//custome hook to expose union context modifications while hiding implementation
const useUnionDispatch = () => {
  const context = React.useContext(UnionDispatchContext);
  if (context === undefined) {
    throw new Error('useUnionDispatch must be used within UnionProvider');
  }
  return context;
};

export { UnionProvider, useUnionState, useUnionDispatch };
