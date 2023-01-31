import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  todo: [],
  showtodo: [],
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    getTodo: (state, action) => {
      state.todo = action.payload;
    },

    showTodo: (state, action) => {
      state.showtodo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getTodo, showTodo } = todoSlice.actions;

export default todoSlice.reducer;

export const todoThunk = () => async (dispatch) => {
  const token = localStorage.getItem("TOKEN");
  const response = await axios(`${process.env.REACT_APP_BACKEND}/todo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  dispatch(getTodo(response.data.todo));
};

export const showtodoThunk = () => async (dispatch) => {
  const token = localStorage.getItem("TOKEN");
  const response = await axios(`${process.env.REACT_APP_BACKEND}/showToDoList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("respond from show")
  console.log(response.data.todo)
  console.log("===================")
  dispatch(showTodo(response.data.todo));
};

export const addtodoThunk =
  ({ list }) =>
    async (dispatch) => {
      console.log(list);
      const token = localStorage.getItem("TOKEN");
      const res = await axios.post(`${process.env.REACT_APP_BACKEND}/addToDoList`, {
        list,
        token,
      });
      console.log("respond from add")
      console.log(res.data)
      console.log("===================")

      let tmp = [];
      tmp.push(res.data)
      dispatch(showTodo(tmp));

      document.getElementById("addBox").value ="";
    };

export const deletetodoThunk =
  ({ id }) =>
    async () => {
      const token = localStorage.getItem("TOKEN");
      await axios.post(`${process.env.REACT_APP_BACKEND}/deleteToDoList`, {
        id,
        token
      });
    };

export const edittodoThunk =
  ({ id, edit }) =>
    async (dispatch) => {
      const token = localStorage.getItem("TOKEN");
      let res = await axios.post(`${process.env.REACT_APP_BACKEND}/editToDoList`, {
        id,
        edit,
        token
      });
      let tmp = [];
      tmp.push(res.data)
      dispatch(showTodo(tmp));
    };