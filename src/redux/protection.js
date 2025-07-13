import { loginAction } from "./actions/user.actions";

export const ErrorsAction = (error, dispatch, action) => {
  const message =
    error.message && error.response.data.message
      ? error.response.data.message
      : error.message;
  if (message === "Not authorized, Token Failed") {
    //   dispatch({ type: userContants.USER_LOGOUT });
    dispatch(loginAction({}));
  }
  return dispatch({ type: action, payload: message });
};

// api token to protect
export const tokenProtection = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  if (!userInfo?.token) {
    return null;
  } else {
    return userInfo?.token;
  }
};
