import { createContext, useReducer } from 'react'
import { useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.message
    case "CLEAR":
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const [notification, dispatch] = useContext(NotificationContext);

  const showNotification = (message, seconds) => {
    dispatch({ type: 'SET', message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, seconds * 1000);
  };

  return {
    notification,
    showNotification,
  };
};

export default NotificationContext