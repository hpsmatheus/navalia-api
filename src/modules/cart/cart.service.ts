import { Inject, Injectable } from '@nestjs/common';
import Cart from 'src/typings/cart/cart.entity';
import AddProductDto from 'src/typings/product/add-product.dto';
import CartProduct from 'src/typings/product/cart-product.entity';
import { ICacheClient } from '../cache/cache-client.interface';
import ProductService from '../product/product.service';

const cartKey = (userEmail: string): string => `cart-${userEmail}`;

@Injectable()
export default class CartService {
  constructor(
    @Inject(ICacheClient) private readonly cacheClient: ICacheClient,
    private readonly productService: ProductService,
  ) {}

  public async addProduct(
    userEmail: string,
    dto: AddProductDto,
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

  private async saveCart(userEmail, cart: Cart): Promise<void> {
    await this.cacheClient.setValue(cartKey(userEmail), cart);
  }
}
