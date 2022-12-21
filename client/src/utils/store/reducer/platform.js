import { createSlice } from "@reduxjs/toolkit";

import { getPlatform, getPlatformViaId } from "utils/api/Platform";

const initialState = {
  links: [],
  platform: [],
  overview: [],
  codeId: null,
  isFetching: false,
  error: null,
};

const platform = createSlice({
  name: "platform",
  initialState,
  reducers: {
    initPlatfrom: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    SuccessPlatform: (state, { payload }) => {
      state.links = payload.links;
      state.platform = payload.platform;
      state.codeId = payload._id;
      state.overview = payload.overview;
      state.isFetching = false;
    },
    ErrorPlatform: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    },
    ResetPlatform: (state) => {
      state.links = [];
      state.platform = [];
      state.codeId = null;
      state.overview = [];
      state.isFetching = false;
      state.error = null;
    },
  },
});

export const { initPlatfrom, SuccessPlatform, ErrorPlatform, ResetPlatform } =
  platform.actions;

export const requestPlatform = (params) => async (dispatch) => {
  dispatch(initPlatfrom());
  const { status, data } = await getPlatform(params);

  status === 200
    ? dispatch(SuccessPlatform(data))
    : dispatch(ErrorPlatform("Something went wrong."));
};

export const requestPlatformViaId = (id) => async (dispatch) => {
  dispatch(initPlatfrom());

  const { status, data } = await getPlatformViaId(id);

  status === 200
    ? dispatch(SuccessPlatform(data))
    : dispatch(ErrorPlatform("Something went wrong."));
};

export default platform.reducer;
