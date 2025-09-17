import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TStateFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  orderModal: TOrder | null;
  loading: boolean;
  error: null | string | undefined;
};

const initialState: TStateFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  orderModal: null,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feeds/getFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response;
    } catch (error) {
      return rejectWithValue('Error feed data');
    }
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
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModal = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalOrders: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    selectOrderModal: (state) => state.orderModal
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
