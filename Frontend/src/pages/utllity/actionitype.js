import { ADD_TO_BASKET } from "./actionitype";

export const addToBasket = (item) => {
  return {
    type: ADD_TO_BASKET,
    item,
  };
};