import ingredientsSlice, {
  getIngredients,
  TStateIngredients
} from './ingredientsSlice';

describe('Тест ingredientsSlice', () => {
  const initialState: TStateIngredients = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 100,
      fat: 100,
      carbohydrates: 100,
      calories: 100,
      price: 100,
      image: 'image.jpg',
      image_large: 'image_large.jpg',
      image_mobile: 'image_mobile.jpg'
    }
  ];

  it('Тест должен устанавливать флаг загрузки в true при pending', () => {
    const state: TStateIngredients = ingredientsSlice.reducer(
      initialState,
      getIngredients.pending('')
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест должен сохранять ингредиенты и сбрасывать флаг загрузки при fulfilled', () => {
    const state: TStateIngredients = ingredientsSlice.reducer(
      initialState,
      getIngredients.fulfilled(mockIngredients, '')
    );

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('Тест должен сохранять ошибку и сбрасывать флаг загрузки при rejected', () => {
    const errorMessage = 'Request failed';
    const state: TStateIngredients = ingredientsSlice.reducer(
      initialState,
      getIngredients.rejected(new Error(errorMessage), '')
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
