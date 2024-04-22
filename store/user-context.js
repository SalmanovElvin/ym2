import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import { useMutation } from "@apollo/client";
import { SkypeIndicator } from "react-native-indicators";

// context
import { useUnionDispatch } from "./union-context";

// graph
import { LOGIN_WITH_TOKEN, LOGIN_USER } from "../graph/mutations/users";

const defaultUser = {
  loggedIn: false,
  profile: {
    firstName: "Guest",
    lastName: "",
  },
  token: undefined,
};

const USER_KEY = "@USER";

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("uid", action.payload.unionID);
      return {
        ...state,
        ...action.payload,
        loggedIn: true,
      };
    }
    case "LOGOUT": {
      AsyncStorage.removeItem(USER_KEY);
      return defaultUser;
    }
    case "UPDATE": {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload));
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

const UserProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(userReducer, defaultUser);
  const [token, setToken] = React.useState();

  const unionDispatch = useUnionDispatch();

  const [loginWithToken, { error, loading }] = useMutation(LOGIN_WITH_TOKEN, {
    onCompleted: (data) => {
      unionDispatch({
        type: "ASSIGN",
        payload: data.loginWithToken.union,
      });
      dispatch({
        type: "LOGIN",
        payload: { ...data.loginWithToken.user, token: token },
      });
    },
  });

  useEffect(() => {
    const getAsyncToken = async () => {
      let tempToken = await AsyncStorage.getItem(USER_KEY);

      setToken(tempToken);
      if (!!tempToken) {
        loginWithToken({ variables: { token: tempToken, device: "mobile" } });
      }
    };
    getAsyncToken();
  }, []);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {loading ? <SkypeIndicator color="white" /> : children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

const useUserState = () => {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within UserProvider");
  }
  return context;
};

const useUserDispatch = () => {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    console.log("error!! useUserDispatch must be used within UserProvider");
    throw new Error("useUserDispatch must be used within UserProvider");
  }
  return context;
};

export { UserProvider, useUserState, useUserDispatch };
