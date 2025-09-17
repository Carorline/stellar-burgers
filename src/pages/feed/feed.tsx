import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { get } from 'http';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedOrders, getFeeds } from '../../services/feedSlice';
import { getLoading } from '../../services/burgerConstructorSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoading);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getFeedOrders);

  useEffect(() => {
    dispatch(getFeeds()).then((result) => {});
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
