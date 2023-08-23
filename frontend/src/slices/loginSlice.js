import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  //get userInfo as parse if it exists, if not then null
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      //set the userInfo state to the payload
      //because when I get to the backend and hit the userApiSLice we send the user info as the payload in action
      //and store it in localstorage
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    }
  }
});

export const { setCredentials, logout } = loginSlice.actions;
export default loginSlice.reducer;