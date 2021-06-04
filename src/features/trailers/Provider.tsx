import { setCustomOrder } from "@screens/trailers/actions";
import { OrderFunctions } from "@screens/trailers/reducer";
import { State, useTypedSelector } from "@store/index";
import React from "react";
import { useDispatch } from "react-redux";
import { TRAILER_SORT_UPDATE_INTERVAL } from "../../config";

export const TrailerObserverProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();

  /**
   * If the order changes, store it in a ref, so that we don't trigger
   * the re-order and risk a loop
   */
  const orderFunction = useTypedSelector<OrderFunctions | null>(
    (state: State) => state.trailers.orderFunction
  );
  const orderFunctionRef = React.useRef<OrderFunctions | null>(null);

  orderFunctionRef.current = orderFunction;
  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch(setCustomOrder(orderFunctionRef.current));
    }, TRAILER_SORT_UPDATE_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);
  return <>{children}</>;
};
