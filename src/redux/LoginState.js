import { createStore } from "redux";

function login(state = false, action) {
  return (state = action.type);
}

export const loginState = createStore(login);
