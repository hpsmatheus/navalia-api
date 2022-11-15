import { mock } from 'jest-mock-extended';
import { ICacheClient } from '../../../../src/modules/cache/cache-client.interface';
import CartService from '../../../../src/modules/cart/cart.service';
import ProductService from '../../../../src/modules/product/product.service';

describe('Cart Service', () => {
  it('calcTotalPrice', async () => {
    console.log('aaa');
    const cacheClient = mock<ICacheClient>();
    const productService = mock<ProductService>();
    const service = new CartService(cacheClient, productService);
    cacheClient.getValue.mockResolvedValueOnce({
      userEmail: 'email',
      products: [
        { id: 1, price: 10, quantity: 2 },
        { id: 2, price: 5, quantity: 2 },
      ],
    });

    const result = await service.calcTotalPrice('email');
    console.log(result);
  });
});
