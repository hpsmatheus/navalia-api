import { mock } from 'jest-mock-extended';
import { ICacheClient } from '../../../../src/modules/cache/cache-client.interface';
import CartService from '../../../../src/modules/cart/cart.service';
import ProductService from '../../../../src/modules/product/product.service';

describe('Cart Service', () => {
  const cacheClient = mock<ICacheClient>();
  const productService = mock<ProductService>();
  const service = new CartService(cacheClient, productService);
  it('calcTotalPrice 1', async () => {
    cacheClient.getValue.mockResolvedValueOnce({
      userEmail: 'email',
      products: [
        { id: 1, price: 10, quantity: 2 },
        { id: 2, price: 5, quantity: 2 },
      ],
    });

    const result = await service.calcTotalPrice('email');
    expect(result.finalPrice).toBe(25);
  });

  it('calcTotalPrice 2', async () => {
    cacheClient.getValue.mockResolvedValueOnce({
      userEmail: 'email',
      products: [{ id: 1, price: 12.99, quantity: 3 }],
    });

    const result = await service.calcTotalPrice('email');
    expect(result.finalPrice).toBe(25.98);
  });

  it('calcTotalPrice 3', async () => {
    cacheClient.getValue.mockResolvedValueOnce({
      userEmail: 'email',
      products: [
        { id: 1, price: 12.99, quantity: 2 },
        { id: 2, price: 25, quantity: 2 },
      ],
    });

    const result = await service.calcTotalPrice('email');
    expect(result.finalPrice).toBe(62.99);
  });

  it('calcTotalPrice 4', async () => {
    cacheClient.getValue.mockResolvedValueOnce({
      userEmail: 'email',
      products: [
        { id: 1, price: 12.99, quantity: 1 },
        { id: 2, price: 25, quantity: 2 },
        { id: 3, price: 20.65, quantity: 3 },
      ],
    });

    const result = await service.calcTotalPrice('email');
    expect(result.finalPrice).toBe(91.3);
  });

  it('calcTotalPrice 5', async () => {
    cacheClient.getValue.mockResolvedValueOnce({
      userEmail: 'email',
      products: [{ id: 1, price: 12.99, quantity: 2 }],
    });

    const result = await service.calcTotalPrice('email');
    expect(result.finalPrice).toBe(25.98);
  });
});
