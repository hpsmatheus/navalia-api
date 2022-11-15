import CartProduct from './cart-product.entity';

export default class Cart {
  userEmail: string;

  products: CartProduct[];
}
