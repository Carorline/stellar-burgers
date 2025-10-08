import userSlice, {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  setAuthChecked,
  UserState
} from './userSlice';

describe('Тест userSlice', () => {
  const initialState: UserState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('synchronous actions', () => {
    it('Тест должен устанавливать флаг проверки авторизации', () => {
      const state = userSlice.reducer(initialState, setAuthChecked(true));

      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('async actions', () => {
    describe('registerUser', () => {
      it('Тест должен устанавливать loading в true при pending', () => {
        const state = userSlice.reducer(
          initialState,
          registerUser.pending('', { email: '', name: '', password: '' })
        );

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать пользователя и loading в false при fulfilled', () => {
        const state = userSlice.reducer(
          initialState,
          registerUser.fulfilled(mockUser, '', {
            email: '',
            name: '',
            password: ''
          })
        );

        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать ошибку и loading в false при rejected', () => {
        const errorMessage = 'Registration failed';
        const state = userSlice.reducer(
          initialState,
          registerUser.rejected(new Error(errorMessage), '', {
            email: '',
            name: '',
            password: ''
          })
        );

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('loginUser', () => {
      it('Тест должен устанавливать loading в true при pending', () => {
        const state = userSlice.reducer(
          initialState,
          loginUser.pending('', { email: '', password: '' })
        );

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать пользователя и loading в false при fulfilled', () => {
        const state = userSlice.reducer(
          initialState,
          loginUser.fulfilled(mockUser, '', { email: '', password: '' })
        );

        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать ошибку и loading в false при rejected', () => {
        const errorMessage = 'Login failed';
        const state = userSlice.reducer(
          initialState,
          loginUser.rejected(new Error(errorMessage), '', {
            email: '',
            password: ''
          })
        );

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('getUser', () => {
      it('Тест должен устанавливать loading в true при pending', () => {
        const state = userSlice.reducer(initialState, getUser.pending(''));

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать пользователя, loading в false и флаг проверки авторизации при fulfilled', () => {
        const state = userSlice.reducer(
          initialState,
          getUser.fulfilled(mockUser, '')
        );

        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать loading в false и флаг проверки авторизации даже при rejected', () => {
        const state = userSlice.reducer(
          initialState,
          getUser.rejected(new Error(''), '')
        );

        expect(state.isLoading).toBe(false);
        expect(state.isAuthChecked).toBe(true);
      });
    });

    describe('updateUser', () => {
      it('Тест должен устанавливать loading в true при pending', () => {
        const state = userSlice.reducer(
          initialState,
          updateUser.pending('', { name: 'New Name' })
        );

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('Тест должен обновлять пользователя и устанавливать loading в false при fulfilled', () => {
        const updatedUser = { ...mockUser, name: 'Updated User' };
        const state = userSlice.reducer(
          { ...initialState, user: mockUser },
          updateUser.fulfilled(updatedUser, '', { name: 'Updated User' })
        );

        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(updatedUser);
        expect(state.error).toBeNull();
      });

      it('Тест должен устанавливать ошибку и loading в false при rejected', () => {
        const errorMessage = 'Update failed';
        const state = userSlice.reducer(
          initialState,
          updateUser.rejected(new Error(errorMessage), '', { name: 'New Name' })
        );

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('logoutUser', () => {
      it('Тест должен очищать пользователя при fulfilled', () => {
        const state = userSlice.reducer(
          { ...initialState, user: mockUser },
          logoutUser.fulfilled(undefined, '')
        );

        expect(state.user).toBeNull();
      });
    });
  });
});
