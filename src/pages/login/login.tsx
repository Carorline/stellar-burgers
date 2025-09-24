import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TLoginData } from '@api';
import { useDispatch } from '../../services/store';
import { getIsLoading, loginUser, selectUser } from '../../services/userSlice';
import { useSelector } from 'react-redux';
import { get } from 'http';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(getIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userLoginData: TLoginData = {
      email: email,
      password: password
    };
    dispatch(loginUser(userLoginData));
  };

  if (user && !isLoading) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
