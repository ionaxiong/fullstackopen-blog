import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    type: "",
  },
  reducers: {
    setNotification: (state, action) => {
      return action.payload;
    },
    clearNotification: (state) => {
      state.message = "";
      state.type = "";
    },
  },
});

export const setNotificationWithTimeout = (message, timeout, type) => {
  console.log("setNotificationWithTimeoutssage", message, timeout, type);

  return (dispatch) => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, timeout * 1000);
  };
};

export const selectNotification = (state) => state.notification;

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
