import feedSlice, { getFeeds, getProfileOrders, TStateFeed } from './feedSlice';

describe('Тест feedSlice', () => {
  const initialState: TStateFeed = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  const mockOrders = [
    {
      _id: '1',
      status: 'done',
      name: 'Test Order 1',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Test Order 2',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      number: 2,
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  const mockFeedResponse = {
    success: true,
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  describe('async actions', () => {
    describe('getFeeds', () => {
      it('Тест должен устанавливать loading в true при pending', () => {
        const state = feedSlice.reducer(initialState, getFeeds.pending(''));

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать заказы, общие счетчики и loading в false при fulfilled', () => {
        const state = feedSlice.reducer(
          initialState,
          getFeeds.fulfilled(mockFeedResponse, '')
        );

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual(mockOrders);
        expect(state.total).toBe(100);
        expect(state.totalToday).toBe(10);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать ошибку и loading в false при rejected', () => {
        const errorMessage = 'Network error';
        const state = feedSlice.reducer(
          initialState,
          getFeeds.rejected(new Error(errorMessage), '')
        );

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('getProfileOrders', () => {
      it('Тест должен устанавливать loading в true при pending', () => {
        const state = feedSlice.reducer(
          initialState,
          getProfileOrders.pending('')
        );

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать заказы профиля и loading в false при fulfilled', () => {
        const state = feedSlice.reducer(
          initialState,
          getProfileOrders.fulfilled(mockOrders, '')
        );

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual(mockOrders);
        expect(state.error).toBeNull();
        // Проверяем, что total и totalToday не изменились
        expect(state.total).toBe(0);
        expect(state.totalToday).toBe(0);
      });

      it('Тест должен устанавливать ошибку и loading в false при rejected', () => {
        const errorMessage = 'Profile orders failed';
        const state = feedSlice.reducer(
          initialState,
          getProfileOrders.rejected(new Error(errorMessage), '')
        );

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });
  });
});
