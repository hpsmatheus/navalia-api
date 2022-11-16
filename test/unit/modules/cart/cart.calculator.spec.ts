import CartCalculator from '../../../../src/modules/cart/cart.calculator';
import CartProduct from '../../../../src/typings/cart/cart-product.entity';
import Cart from '../../../../src/typings/cart/cart.entity';
import Constants from '../../../constants';

const mockCart = (products: CartProduct[]): Cart => {
  return {
    userEmail: Constants.anyString,
    products,
  };
};

describe('Cart Service', () => {
  let products: CartProduct[];

  describe('should not give discounts when', () => {
    it('cart is empty', async () => {
      const cart = mockCart([]);
      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 0,
        priceWithoutDiscounts: 0,
      });
    });

    it('cart not empty has less than 3 products', async () => {
      products = [{ id: 1, price: 12.99, quantity: 2 }];
      const cart = mockCart(products);
      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 25.98,
        priceWithoutDiscounts: 25.98,
      });
    });
  });

  describe('should give 1 discount when', () => {
    it('cart has 3x same product', async () => {
      products = [{ id: 1, price: 12.99, quantity: 3 }];
      const cart = mockCart(products);
      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 25.98,
        priceWithoutDiscounts: 38.97,
      });
    });

    it('cart has 4 different products', async () => {
      products = [
        { id: 1, price: 12.99, quantity: 2 },
        { id: 2, price: 25, quantity: 2 },
      ];
      const cart = mockCart(products);

      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 62.99,
        priceWithoutDiscounts: 75.98,
      });
    });

    it('cart has 5 different products', async () => {
      products = [
        { id: 1, price: 12.99, quantity: 1 },
        { id: 2, price: 25, quantity: 2 },
        { id: 3, price: 20.65, quantity: 3 },
      ];
      const cart = mockCart(products);

      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 91.3,
        priceWithoutDiscounts: 124.94,
      });
    });
  });

  describe('should give multiple discounts', () => {
    it('should give 2 discounts when cart has 6 different products', async () => {
      products = [
        { id: 1, price: 12.99, quantity: 2 },
        { id: 2, price: 25, quantity: 2 },
        { id: 3, price: 20.65, quantity: 3 },
      ];
      const cart = mockCart(products);

      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 111.95,
        priceWithoutDiscounts: 137.93,
      });
    });

    it('should give 4 discount when cart has 13 different products', async () => {
      products = [
        { id: 1, price: 5, quantity: 2 },
        { id: 2, price: 10, quantity: 2 },
        { id: 3, price: 100, quantity: 9 },
      ];
      const cart = mockCart(products);

      const result = await CartCalculator.calcTotalPrice(cart);
      expect(result).toStrictEqual({
        cart,
        finalPrice: 900,
        priceWithoutDiscounts: 930,
      });
    });
  });
});
