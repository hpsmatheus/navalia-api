import Cart from './cart.entity';

export default class TotalPriceResponse {
  cart: Cart;

  priceWithoutDiscounts: number;

  finalPrice: number;
}
