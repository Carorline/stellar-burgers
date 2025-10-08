import burgerConstructorSlice, {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder
} from './burgerConstructorSlice';
import { TConstructorIngredient, TOrder } from '@utils-types';

describe('Тест burgerConstructorSlice ', () => {
  const mockIngredient: TConstructorIngredient = {
    id: '1',
    _id: '1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const mockBun: TConstructorIngredient = {
    id: '2',
    _id: '2',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  it('Тест добавление ингредиента в конструктор', () => {
    const action = addIngredient(mockIngredient);
    const result = burgerConstructorSlice.reducer(undefined, action);
    expect(result.constructorItems.ingredients).toHaveLength(1);
    expect(result.constructorItems.ingredients[0]).toMatchObject({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('Тест добавления булки в конструктор', () => {
    const action = addIngredient(mockBun);
    const result = burgerConstructorSlice.reducer(undefined, action);

    expect(result.constructorItems.bun).toMatchObject({
      ...mockBun,
      id: expect.any(String)
    });
  });

  it('Тест удаления ингредиента', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [{ ...mockIngredient, id: 'test-id' }]
      },
      orderRequest: false,
      orderData: null,
      loading: false,
      error: null
    };

    const action = deleteIngredient({ ...mockIngredient, id: 'test-id' });
    const result = burgerConstructorSlice.reducer(initialState, action);
    expect(result.constructorItems.ingredients).toHaveLength(0);
  });

  it('Тест изменения порядка ингредиентов в конструкторе(вверх)', () => {
    const ingredients = [
      { ...mockIngredient, id: '1' },
      { ...mockIngredient, id: '2' }
    ];

    const initialState = {
      constructorItems: { bun: null, ingredients },
      orderRequest: false,
      orderData: null,
      loading: false,
      error: null
    };

    const action = moveUpIngredient(1); // Перемещаем второй элемент вверх
    const result = burgerConstructorSlice.reducer(initialState, action);
    expect(result.constructorItems.ingredients[0].id).toEqual('2');
    expect(result.constructorItems.ingredients[1].id).toEqual('1');
  });

  it('Тест изменения порядка ингредиентов в конструкторе(вниз)', () => {
    const ingredients = [
      { ...mockIngredient, id: '1' },
      { ...mockIngredient, id: '2' }
    ];

    const initialState = {
      constructorItems: { bun: null, ingredients },
      orderRequest: false,
      orderData: null,
      loading: false,
      error: null
    };

    const action = moveDownIngredient(0); // Перемещаем первый элемент вниз
    const result = burgerConstructorSlice.reducer(initialState, action);
    expect(result.constructorItems.ingredients[0].id).toEqual('2');
    expect(result.constructorItems.ingredients[1].id).toEqual('1');
  });

  it('Тест очищения конструктора', () => {
    const initialState = {
      constructorItems: { bun: null, ingredients: [] },
      orderRequest: false,
      orderData: {} as TOrder,
      loading: false,
      error: 'Some error'
    };

    const action = clearOrder();
    const result = burgerConstructorSlice.reducer(initialState, action);
    expect(result.orderData).toBeNull();
    expect(result.error).toBeNull();
  });
});
