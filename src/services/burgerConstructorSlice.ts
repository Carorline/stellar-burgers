import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../utils/burger-api';

export type TStateBurgerConstructor = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: null | string | undefined;
};

const initialState: TStateBurgerConstructor = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, key, id: key } };
      }
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const newIngredients = state.constructorItems.ingredients;
        [(newIngredients[index - 1] = newIngredients[index])];
        [newIngredients[index], newIngredients[index - 1]];
      }
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        const newIngredients = state.constructorItems.ingredients;
        [(newIngredients[index + 1] = newIngredients[index])];
        [newIngredients[index], newIngredients[index + 1]];
      }
    },
    clearOrder: () => {
      initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
        state.error = null;
      });
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

export default burgerConstructorSlice;
export const {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getLoading,
  getError
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder
} = burgerConstructorSlice.actions;
