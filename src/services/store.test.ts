import { expect, test } from '@jest/globals';
import { rootReducer } from './store';
import store from './store';

describe('Тест rootReducer', () => {
  test('Тест правильной инициализации rootReducer', () => {
    //создаем тестовый экшен
    const testAction = { type: 'UNKNOWN_ACTION' };

    //вызываем редюсер с undefined состоянием и тестовым экшеном
    //чтобы получить начальное состояние
    const initialState = rootReducer(undefined, testAction);

    //сравниваем начальное состояние с состоянием в сторе
    expect(initialState).toEqual(store.getState());
  });
});
