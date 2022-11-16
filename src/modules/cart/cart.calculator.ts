import Cart from 'src/typings/cart/cart.entity';
import TotalPriceResponse from 'src/typings/cart/total-price.response';
import _ from 'lodash';
import CartProduct from 'src/typings/cart/cart-product.entity';

const minQuantityToGiveDiscount = 3;

export default class CartCalculator {
  public static async calcTotalPrice(cart: Cart): Promise<TotalPriceResponse> {
    if (cart.products.length === 0) return this.buildEmptyCart(cart);

    const priceWithoutDiscounts = this.calcPriceWithoutDiscounts(cart);
    const finalPrice = this.calcPriceWithDiscounts(cart, priceWithoutDiscounts);

    return {
      cart,
      finalPrice: this.formatMoney(finalPrice),
      priceWithoutDiscounts: this.formatMoney(priceWithoutDiscounts),
    };
  }

  private static buildEmptyCart(cart: Cart): TotalPriceResponse {
    return {
      cart,
      finalPrice: 0,
      priceWithoutDiscounts: 0,
    };
  }

  private static calcPriceWithoutDiscounts(cart: Cart): number {
    return cart.products
      .map((product) => product.price * product.quantity)
      .reduce((prev, next) => prev + next);
  }

  private static calcPriceWithDiscounts(
    cart: Cart,
    priceWithoutDiscounts: number,
  ): number {
    const numberOfDiscounts = this.calcNumberOfDiscounts(cart);
    const products = _.cloneDeep(cart.products);
    let finalPrice = priceWithoutDiscounts;
    for (let i = 0; i < numberOfDiscounts; i++) {
      const index = products.indexOf(_.minBy(products, 'price'));
      finalPrice -= products[index].price;
      this.removeDiscountedProductFromArray(products, index);
    }
    return finalPrice;
  }

  private static calcNumberOfDiscounts(cart: Cart): number {
    const countCartItems = this.countItemsInCart(cart);
    return Math.trunc(countCartItems / minQuantityToGiveDiscount);
  }

  private static countItemsInCart(cart: Cart): number {
    return cart.products
      .map((product) => product.quantity)
      .reduce((prev, next) => prev + next);
  }

  private static removeDiscountedProductFromArray(
    products: CartProduct[],
    index: number,
  ): void {
    if (products[index].quantity === 1) {
      products.splice(index, 1);
    } else {
      products[index].quantity--;
    }
  }

  private static formatMoney(value: number): number {
    const decimalPlaces = 2;
    return Number(value.toFixed(decimalPlaces));
  }
}
