import { Inject, Injectable } from '@nestjs/common';
import Cart from 'src/typings/cart/cart.entity';
import AddProductToCartDto from 'src/typings/cart/add-product.dto';
import { ICacheClient } from '../cache/cache-client.interface';
import ProductService from '../product/product.service';
import CartProduct from 'src/typings/cart/cart-product.entity';
import RemoveProductFromCartDto from 'src/typings/cart/remove-product.dto';
import TotalPriceResponse from 'src/typings/cart/total-price.response';
import _ from 'lodash';

const cartKey = (userEmail: string): string => `cart-${userEmail}`;
const baseLineNumberToGiveADiscount = 3;

@Injectable()
export default class CartService {
  constructor(
    @Inject(ICacheClient) private readonly cacheClient: ICacheClient,
    private readonly productService: ProductService,
  ) {}

  public async addProduct(
    userEmail: string,
    dto: AddProductToCartDto,
  ): Promise<void> {
    const product = await this.productService.getById(dto.productId);
    const cart = await this.getCart(userEmail);

    this.upsertProductInCart(cart, {
      id: product.id,
      price: product.price,
      quantity: dto.quantity,
    });

    await this.saveCart(userEmail, cart);
  }

  public async removeProduct(
    userEmail: string,
    dto: RemoveProductFromCartDto,
  ): Promise<void> {
    const product = await this.productService.getById(dto.productId);
    const cart = await this.getCart(userEmail);
    this.removeProductFromCart(cart, product.id, dto.removeAll);
    await this.saveCart(userEmail, cart);
  }

  public async calcTotalPrice(userEmail: string): Promise<TotalPriceResponse> {
    const cart = await this.getCart(userEmail);
    const countCartItems = this.countItemsInCart(cart);
    const priceWithoutDiscounts = this.calcPriceWithoutDiscounts(cart);
    const numberOfDiscounts = Math.trunc(
      countCartItems / baseLineNumberToGiveADiscount,
    );

    const products = [...cart.products];
    let totalPrice = priceWithoutDiscounts;
    for (let i = 0; i < numberOfDiscounts; i++) {
      const index = products.indexOf(_.minBy(products, 'price'));
      totalPrice -= products[index].price;
      if (products[index].quantity === 1) {
        products.splice(index, 1);
      } else {
        products[index].quantity--;
      }
    }

    return { cart, totalPrice, priceWithoutDiscounts };
  }

  private async getCart(userEmail: string): Promise<Cart> {
    const cart = await this.cacheClient.getValue(cartKey(userEmail));
    return cart ? (cart as Cart) : { userEmail, products: [] };
  }

  private upsertProductInCart(cart: Cart, product: CartProduct): void {
    const existingProductOnCart = cart.products.findIndex(
      (existingProduct) => existingProduct.id === product.id,
    );

    if (existingProductOnCart >= 0) {
      cart.products[existingProductOnCart].quantity += product.quantity;
    } else {
      cart.products.push(product);
    }
  }

  private removeProductFromCart(
    cart: Cart,
    productId: number,
    removeAll: boolean,
  ): void {
    const existingProductOnCart = cart.products.findIndex(
      (existingProduct) => existingProduct.id === productId,
    );

    if (existingProductOnCart >= 0) {
      if (removeAll || cart.products[existingProductOnCart].quantity === 1) {
        cart.products.splice(existingProductOnCart, 1);
      } else {
        cart.products[existingProductOnCart].quantity--;
      }
    }
  }

  private async saveCart(userEmail, cart: Cart): Promise<void> {
    await this.cacheClient.setValue(cartKey(userEmail), cart);
  }

  private countItemsInCart(cart: Cart): number {
    return cart.products
      .map((product) => product.quantity)
      .reduce((prev, next) => prev + next);
  }

  private calcPriceWithoutDiscounts(cart: Cart): number {
    return cart.products
      .map((product) => product.price * product.quantity)
      .reduce((prev, next) => prev + next);
  }
}
