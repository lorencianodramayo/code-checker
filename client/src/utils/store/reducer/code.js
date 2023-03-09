import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { addCodeChecker } from 'utils/api/CodeChecker';

const initialState = {
  data: [],
  isFetching: false,
  error: null,
};

const code = createSlice({
  name: 'code',
  initialState,
  reducers: {
    initCodeChecker: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    SuccessCodeChecker: (state, { payload }) => {
      if (!_.some(state.data, (data) => data?.name === payload.name)) {
        state.data = [...state.data, payload];
        state.isFetching = false;
      }
    },
    ErrorCodeChecker: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    },
    ResetCodeChecker: (state) => {
      state.data = [];
      state.error = null;
    },
  },
});

export const {
  initCodeChecker,
  SuccessCodeChecker,
  ErrorCodeChecker,
  ResetCodeChecker,
} = code.actions;

export const requestCodeCheck = (params) => async (dispatch) => {
  dispatch(initCodeChecker());
  console.log(params);

  const { status, data } = await addCodeChecker({
    left: _.isEmpty(params?.left) ? '' : params.left,
    right: _.isEmpty(params?.right) ? '' : params?.right,
    diff_level: params?.diff_level,
  });

  status === 200
    ? dispatch(
        SuccessCodeChecker({
          name: params?.name,
          code: data?.code,
          details: data?.details,
        })
      )
    : dispatch(ErrorCodeChecker('Something went wrong.'));
};

export default code.reducer;
