import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// Remove import for SecureStore

// Implement redux style state and dispatch items to efficiently utilize union context
const UnionStateContext = React.createContext();
const UnionDispatchContext = React.createContext();

const UNION_KEY = 'UNION';

// Implement redux style reducer to limit actions by dispatch callers
const unionReducer = (state, action) => {
  // Switch by action types
  switch (action.type) {
    case 'ASSIGN': {
      AsyncStorage.setItem(UNION_KEY, JSON.stringify(action.payload)); // Use AsyncStorage
      return { ...state, ...action.payload };
    }
    case 'UPDATE': {
      AsyncStorage.setItem(UNION_KEY, JSON.stringify(action.payload)); // Use AsyncStorage
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'RESET': {
      AsyncStorage.removeItem(UNION_KEY); // Use AsyncStorage
      return {};
    }
    default: {
      throw new Error(`Undefined actiontype: ${action.type}`);
    }
  }
};

// Create union context provider
const UnionProvider = ({ children }) => {
  // UseReducer to optimize performance and use callbacks
  const [state, dispatch] = React.useReducer(unionReducer, {});

  // Pass state and dispatch to wrapped child components
  return (
    <UnionStateContext.Provider value={state}>
      <UnionDispatchContext.Provider value={dispatch}>
        {children}
      </UnionDispatchContext.Provider>
    </UnionStateContext.Provider>
  );
};

// Custom hook to expose usercontext value while hiding implementation
const useUnionState = () => {
  const context = React.useContext(UnionStateContext);
  if (context === undefined) {
    throw new Error('useUnionState must be used within UnionProvider');
  }
  return context;
};

// Custom hook to expose union context modifications while hiding implementation
const useUnionDispatch = () => {
  const context = React.useContext(UnionDispatchContext);
  if (context === undefined) {
    throw new Error('useUnionDispatch must be used within UnionProvider');
  }
  return context;
};

export { UnionProvider, useUnionState, useUnionDispatch };