import CartProduct from '../product/cart-product.entity';

export default class Cart {
  userEmail: string;

  products: CartProduct[];
}
