import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TStateFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: null | string | undefined;
};

const initialState: TStateFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feeds/getFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const getProfileOrders = createAsyncThunk(
  'feeds/getProfileOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalOrders: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

export default feedSlice;
export const {
  getFeedOrders,
  getTotalOrders,
  getTotalToday,
  getLoading,
  getError
} = feedSlice.selectors;
