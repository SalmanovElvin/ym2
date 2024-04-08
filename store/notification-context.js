import React, { useReducer } from "react";

const NotificationStateContext = React.createContext();
const NotificationDispatchContext = React.createContext();

const notificationReducer = (state, action) => {
  //switch by action types

  switch (action.type) {
    case "ASSIGN": {
      return [...action.payload];
    }
    default: {
      throw new Error(`Undefined action type: ${action.type}`);
    }
  }
};

const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, []);
  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
};

const useNotificationState = () => {
  const context = React.useContext(NotificationStateContext);
  if (context === undefined) {
    throw new Error("useNotifState must be used within NotifProvider");
  }
  return context;
};

const useNotificationDispatch = () => {
  const context = React.useContext(NotificationDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationDispatch must be used within NotificationProvider"
    );
  }
  return context;
};

export { NotificationProvider, useNotificationDispatch, useNotificationState };
